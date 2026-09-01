#!/usr/bin/env bash
#
# first_setup.sh — one-shot local environment setup for hjulverkstan.
#
# Works on macOS and Windows (run it from Git Bash).
# Usage:  bash first_setup.sh
#
# What it does:
#   1. Detects the OS and required tools (git, curl, npm)
#   2. Installs mise if missing (brew on macOS, winget on Windows)
#   3. Installs the pinned runtimes from .tool-versions (Node 22, Java 21)
#   4. Verifies node / java / maven resolve to the pinned versions
#   5. Applies the project git config (hooks path, LF endings)
#   6. Creates .env from .env.template if missing
#   7. Installs npm dependencies for web/ and cdk/
#   8. Checks for Postgres (not installed — see SETUP.md)
#
# Safe to re-run: every step is idempotent.
# It never touches system Node/Java; everything mise installs lives in
# ~/.local/share/mise (Windows: %USERPROFILE%\.local\share\mise).

set -uo pipefail

# ---------------------------------------------------------------- helpers ---

# mise has two layers: the binary (on PATH) and the activation (puts the
# pinned runtimes on PATH). A shell can have one without the other — e.g.
# mise installed via brew but the rc-file activation never sourced. So:
#  - maybe_activate_mise(): if the binary is missing, try the shell rc
#  - activate_mise_runtimes(): always, so the rest of this script (verify,
#    npm install) runs on the PINNED runtimes, not the system ones.
maybe_activate_mise() {
  if ! command -v mise >/dev/null 2>&1; then
    local rc
    case "${SHELL:-}" in
      */zsh)  rc="$HOME/.zshrc" ;;
      */bash) rc="$HOME/.bashrc" ;;
      *)      rc="$HOME/.profile" ;;
    esac
    if [ -f "$rc" ] && grep -q "mise activate" "$rc"; then
      # shellcheck disable=SC1090
      . "$rc" >/dev/null 2>&1 || true
    fi
  fi
  command -v mise >/dev/null 2>&1
}

activate_mise_runtimes() {
  eval "$(mise activate bash)"
}

# ---------------------------------------------------------------- state -----

OS="$(uname -s)"
IS_WINDOWS=0
case "$OS" in
  MINGW* | MSYS* | CYGWIN*) IS_WINDOWS=1 ;;
esac

if [ ! -f .tool-versions ]; then
  echo "Error: .tool-versions not found. Run this script from the repository root." >&2
  exit 1
fi

PASS=0
WARN=0
FAIL=0
declare -a SUMMARY=()

note()    { printf '\n\033[1m== %s\033[0m\n' "$1"; }
ok()      { PASS=$((PASS+1)); SUMMARY+=("ok      - $1"); printf '\033[32m  ✔\033[0m %s\n' "$1"; }
warn()    { WARN=$((WARN+1)); SUMMARY+=("warn    - $1"); printf '\033[33m  ⚠ %s\033[0m\n' "$1"; }
fail()    { FAIL=$((FAIL+1)); SUMMARY+=("FAIL    - $1"); printf '\033[31m  ✘ %s\033[0m\n' "$1"; }
info()    { printf '    %s\n' "$1"; }
step_fail() { fail "$1"; }

# ----------------------------------------------------------------- start ----

note "hjulverkstan first-time setup"
if [ "$IS_WINDOWS" -eq 1 ]; then
  info "OS: Windows (Git Bash)"
else
  info "OS: $OS"
fi

# ------------------------------------------------- 1. required tooling ------

note "1/8  Required tools"

if command -v git >/dev/null 2>&1; then
  ok "git $(git --version | awk '{print $3}')"
else
  step_fail "git not found. Install git: https://git-scm.com/downloads"
fi

if command -v curl >/dev/null 2>&1; then
  ok "curl $(curl --version | head -1 | awk '{print $2}')"
else
  step_fail "curl not found. Install it (macOS: Xcode CLT; Windows: comes with Git)."
fi

# npm is provided by the Node runtime we install below; check only to warn
# that a system Node will be shadowed inside this repo (that is intended).
if command -v node >/dev/null 2>&1; then
  info "system node $(node -v) detected — mise will shadow it inside this repo (intended)"
fi

# --------------------------------------------------- 2. install mise --------

note "2/8  mise (runtime manager)"

if command -v mise >/dev/null 2>&1; then
  ok "mise $(mise --version) already installed"
elif maybe_activate_mise; then
  ok "mise $(mise --version) found in shell config"
else
  MISE_INSTALLED_BY_US=0
  if [ "$IS_WINDOWS" -eq 1 ]; then
    if command -v winget >/dev/null 2>&1; then
      info "installing mise via winget (jdx.mise)…"
      if winget install --id jdx.mise -e --accept-source-agreements --accept-package-agreements; then
        ok "mise installed via winget"
        MISE_INSTALLED_BY_US=1
      else
        step_fail "winget install failed. Install mise manually: https://mise.jdx.dev/installing-mise.html"
      fi
    else
      step_fail "winget not found. Install mise manually: https://mise.jdx.dev/installing-mise.html"
    fi
  elif command -v brew >/dev/null 2>&1; then
    info "installing mise via Homebrew…"
    if brew install mise; then
      ok "mise installed via Homebrew"
      MISE_INSTALLED_BY_US=1
    else
      step_fail "brew install mise failed. Install manually: https://mise.jdx.dev/installing-mise.html"
    fi
  else
    step_fail "no brew found. Install mise manually: curl https://mise.run | sh"
  fi

  # We just installed mise: its binary is on PATH now, but the shell rc
  # activation may not be sourced yet in THIS shell.
  if [ "$MISE_INSTALLED_BY_US" -eq 1 ] && ! maybe_activate_mise; then
    step_fail "mise installed but not active in this shell. Open a NEW terminal and re-run: bash first_setup.sh"
  fi
fi

if ! command -v mise >/dev/null 2>&1; then
  note "Aborting: mise is required for the remaining steps."
  info "See SANDBOX.md for manual instructions."
  exit 1
fi

# Always activate the pinned runtimes in THIS shell, so the verification
# and npm steps below run on Node 22 / Java 21 even when the user's shell
# has mise on PATH without activation (e.g. installed via brew).
activate_mise_runtimes
ok "pinned runtimes activated in this shell"

# ------------------------------------------- 3. install pinned runtimes -----

note "3/8  Pinned runtimes (.tool-versions)"

if [ ! -f .tool-versions ]; then
  step_fail ".tool-versions not found — run this script from the repository root"
else
  info "pinned: $(tr '\n' ' ' < .tool-versions)"
  if mise trust && mise install; then
    ok "runtimes installed/verified by mise"
  else
    step_fail "mise trust/install failed — see output above"
  fi
fi

# --------------------------------------------------- 4. verify runtimes -----

note "4/8  Verify runtimes"

if [ -f .tool-versions ]; then
  want_node="$(awk '$1=="node"{print $2}' .tool-versions)"
  want_java="$(awk '$1=="java"{print $2}' .tool-versions)"
fi

got_node="$(node -v 2>/dev/null || echo none)"
if [ -n "${want_node:-}" ]; then
  case "$got_node" in
    "v${want_node}".*) ok "node $got_node (pinned: $want_node)" ;;
    *) step_fail "node is $got_node, expected v${want_node}.x" ;;
  esac
else
  ok "node $got_node (no pin to check)"
fi

# java -version prints to stderr and exits 0. Compare major versions:
# the pin "temurin-21" means "any Temurin build of Java 21".
want_java_major="${want_java##*-}"
java_out="$(java -version 2>&1 || true)"
got_java="$(printf '%s\n' "$java_out" | head -n 1)"
[ -n "$got_java" ] || got_java="none"
got_java_major="$(printf '%s\n' "$java_out" | sed -n 's/.*version "\([0-9][0-9]*\)\..*/\1/p' | head -n 1)"
if [ -n "${want_java:-}" ]; then
  if [ "${got_java_major:-}" = "$want_java_major" ]; then
    ok "java: $got_java (pinned: $want_java)"
  else
    step_fail "java is '$got_java', expected major version $want_java_major"
  fi
else
  ok "java: $got_java (no pin to check)"
fi

if [ -x api/mvnw ]; then
  mvn_java="$(cd api && ./mvnw -version 2>/dev/null | sed -n 's/^Java version: \([0-9][0-9.]*\).*/\1/p')"
  if [ -n "${want_java:-}" ] && [ "${mvn_java%%.*}" = "$want_java_major" ]; then
    ok "maven wrapper uses Java $mvn_java"
  else
    warn "maven wrapper reports Java '${mvn_java:-unknown}' — expected $want_java_major.x"
  fi
else
  warn "api/mvnw not found or not executable — skipped maven check"
fi

# --------------------------------------------------- 5. git config ----------

note "5/8  Git configuration (project policy)"

if git config core.hooksPath .hooks; then
  ok "git hooks path -> .hooks (pre-commit lint)"
else
  step_fail "could not set git config core.hooksPath"
fi

# Same policy as setup.sh: LF endings everywhere.
# (The --global writes match setup.sh exactly; they only change anything
# if you have never set these before.)
git config --global core.autocrlf false
git config --global core.eol lf
ok "git line endings: LF (core.autocrlf=false, core.eol=lf)"

# -------------------------------------------------------- 6. .env -----------

note "6/8  Environment variables (.env)"

if [ -f .env ]; then
  ok ".env already exists — left untouched"
elif [ -f .env.template ]; then
  cp .env.template .env
  ok ".env created from .env.template"
  info "NOTE: AWS/CDK values are empty — ask a permitted developer for them (see SETUP.md)."
else
  step_fail ".env.template not found — cannot create .env"
fi

# --------------------------------------------------- 7. npm dependencies ----

note "7/8  npm dependencies"

# npm ships with the mise Node runtime (step 3).
if ! command -v npm >/dev/null 2>&1; then
  step_fail "npm not found after mise install — open a new terminal and re-run"
fi

for pkg_dir in web cdk; do
  if [ ! -f "$pkg_dir/package.json" ]; then
    warn "$pkg_dir/package.json not found — skipped"
    continue
  fi
  if (cd "$pkg_dir" && npm install --no-audit --no-fund); then
    ok "npm install in $pkg_dir/"
  else
    step_fail "npm install failed in $pkg_dir/"
  fi
done

# --------------------------------------------------- 8. Postgres ------------

note "8/8  Postgres"

if command -v pg_isready >/dev/null 2>&1; then
  if pg_isready -q 2>/dev/null; then
    ok "Postgres is running and reachable"
  else
    warn "Postgres is installed but not running (or not accepting connections)"
  fi
elif command -v psql >/dev/null 2>&1; then
  ok "Postgres client found (server status not checked)"
  info "Create the database once:  psql -U postgres -c 'CREATE DATABASE hjulverkstan;'"
else
  warn "Postgres not detected — install it and create the 'hjulverkstan' database: see SETUP.md"
fi

# ------------------------------------------------------------- summary ------

note "Summary"
for line in "${SUMMARY[@]}"; do
  case "$line" in
    ok*)     printf '\033[32m%s\033[0m\n' "$line" ;;
    warn*)   printf '\033[33m%s\033[0m\n' "$line" ;;
    FAIL*)   printf '\033[31m%s\033[0m\n' "$line" ;;
  esac
done
printf '\n  %d passed, %d warnings, %d failures\n' "$PASS" "$WARN" "$FAIL"

if [ "$FAIL" -gt 0 ]; then
  printf '\n\033[31mSetup finished with failures — fix the ✘ items above and re-run: bash first_setup.sh\033[0m\n'
  exit 1
fi

# A new terminal is only guaranteed to have mise active if the shell rc
# contains the activation line (or we just installed mise, whose installer
# adds it). Otherwise the user's future shells may still lack it.
RC_HAS_ACTIVATE=0
case "${SHELL:-}" in
  */zsh)  rc="$HOME/.zshrc" ;;
  */bash) rc="$HOME/.bashrc" ;;
  *)      rc="$HOME/.profile" ;;
esac
if [ -f "$rc" ] && grep -q "mise activate" "$rc"; then
  RC_HAS_ACTIVATE=1
fi

if [ "${MISE_INSTALLED_BY_US:-0}" -eq 1 ] || [ "$RC_HAS_ACTIVATE" -eq 0 ]; then
  printf '\n  \033[1mOpen a NEW terminal\033[0m so mise activates in your shell, then continue with SETUP.md.\n'
fi

if [ "$WARN" -gt 0 ]; then
  printf '\n  \033[33mSetup finished with warnings — review the ⚠ items above.\033[0m\n'
  exit 0
fi

printf '\n  \033[32mSetup complete.\033[0m Continue with SETUP.md (Postgres + running the stack).\n'
