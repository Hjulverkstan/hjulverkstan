# Log: creating `first_setup.sh`

Date: 2026-08-26
Author: Claude Code session (review by a developer before merging)
Status: tested on macOS (arm64). **Windows path is written but NOT executed** — it needs a real Windows machine (see "Unverified" below).

Purpose of this file: record what was done, what worked, what broke, and what to
improve — for this project and for future setup scripting on similar stacks
(Node + Java/Maven + Postgres, runtimes managed by mise).

## Goal

One script a new developer (intern included) runs once on a fresh machine:

```bash
bash first_setup.sh
```

…on macOS or Windows (Git Bash), that sets up the whole local environment:
runtimes via mise, git config, `.env`, npm dependencies, and a Postgres check.
Must be idempotent (safe to re-run) and must fail loudly with a readable summary.

## What the script does (final shape)

| Step | Action | Idempotent? |
| ---- | ------ | ----------- |
| 1 | Check `git`, `curl` present; note system node (will be shadowed) | yes |
| 2 | Install mise if missing (brew on macOS, winget on Windows); activate runtimes in the script's own shell | yes |
| 3 | `mise trust && mise install` from `.tool-versions` (Node 22, Java 21 Temurin) | yes |
| 4 | Verify `node -v`, `java -version`, and `api/mvnw` all resolve to the pinned majors | yes |
| 5 | `git config core.hooksPath .hooks` + `--global core.autocrlf false` / `core.eol lf` (mirrors `setup.sh`) | yes |
| 6 | `cp .env.template .env` only if `.env` missing | yes |
| 7 | `npm install` in `web/` and `cdk/` | yes |
| 8 | Postgres check (`pg_isready` / `psql`) — warns, never fails the script | yes |

Exit codes: `0` = success (warnings allowed), `1` = at least one failure.
A color-coded summary of every step is printed at the end.

## Decisions and why

1. **Bash, not PowerShell or a polyglot.** The repo already standardizes on
   bash for Windows (`setup.sh`, the "open Git Bash" instructions in SETUP.md).
   One script, one language, `bash first_setup.sh` everywhere. Git Bash is
   supported by mise (recent versions auto-detect it and convert PATH).
2. **OS branching only where it matters.** The only OS-specific step is
   *installing mise itself*: `brew install mise` (macOS) vs
   `winget install jdx.mise -e` (Windows). Everything else is identical.
   Windows detection: `uname -s` starts with `MINGW`/`MSYS`/`CYGWIN`.
3. **Never use `curl https://mise.run | sh` on Windows** — that installer has
   no Windows binaries (verified against mise docs; supported targets are
   macOS/Linux only). On Windows the official routes are winget or scoop.
4. **The script activates mise in its own shell** (`eval "$(mise activate bash)"`)
   before verifying and before `npm install`. Without this, a machine where
   mise is on PATH but not *activated* (e.g. installed via brew in a shell
   that never sourced the rc line) would verify the *system* runtimes and
   install npm deps with the *system* npm. This bug was real — see below.
5. **Warn, don't fail, for Postgres.** Installing/configuring Postgres is
   interactive and OS-specific (GUI installer on Windows, service on macOS);
   automating it is out of scope and error-prone. The script detects it and
   points to SETUP.md.
6. **`.env` is copy-if-missing, never overwritten.** A re-run must not clobber
   a developer's real secrets.
7. **Guard: must run from repo root** (`.tool-versions` must exist) — a fast,
   clear abort instead of a confusing cascade of failures.
8. **`set -uo pipefail`, but no `set -e`.** Every step is handled explicitly
   with ok/warn/fail so one failure doesn't kill the run and the user still
   gets the full summary. `pipefail` is deliberate (see bug #4 below).
9. **Color output via `printf '\033[...'`**, no TTY detection — simple, and
   the summary is also the machine-readable record. (Could strip colors when
   not a TTY; nice-to-have, not done.)

## Test results (macOS arm64, mise 2026.8.14, git 2.50.1)

| # | Scenario | How it was simulated | Result |
| - | -------- | -------------------- | ------ |
| T1 | Normal run, mise already installed & active | plain `bash first_setup.sh` | first run exposed bugs #1–#4 (below); after fixes: **13 passed, 1 warn (Postgres), 0 fail, exit 0** |
| T2 | mise on PATH but not activated (brew-installed, rc never sourced) | T1's shell state | exposed bug #1; after fix: **exit 0**, correct pinned runtimes used |
| T3 | mise not on PATH at all, but rc has activation | `env PATH=/usr/bin:/bin:... bash first_setup.sh` | rc-sourcing fallback worked: **exit 0** |
| T4 | Fresh machine: no mise, no brew, no rc | `env PATH=... HOME=/tmp/fakehome bash first_setup.sh` | clean abort with actionable message, **exit 1** (after fix #5) |
| T5 | Run from wrong directory | `cd /tmp && bash .../first_setup.sh` | immediate clear error, **exit 1** |

`shellcheck` (0.11.0) is clean on the final script. **Run shellcheck before
considering any change to this script done.**

### Side effects observed during testing

- `npm install` in `web/` bumped a transitive `@types/react` in
  `web/package-lock.json` (18.3.28 → 18.3.31, optional peer dep). The lockfile
  was slightly behind the registry. Harmless, but note: **running the script
  can touch lockfiles** — commit lockfile changes deliberately, and consider
  `npm ci` if byte-identical installs are ever required (trade-off: `npm ci`
  fails when lock and manifest drift, which is arguably a feature in CI, but
  unfriendly to a first-time local setup).
- `.env`, `node_modules/` are all gitignored — no repo pollution.

## Failures found and fixed (the interesting part)

1. **Globs inside `[ ]` don't work.**
   `[ "$OS" = "MINGW"* ]` is always false — shell test doesn't do glob
   matching. shellcheck SC2081 caught it; I had also written it believing
   `=` with a pattern works. Fix: `case "$OS" in MINGW*|MSYS*|CYGWIN*) ...`.
   *Lesson: run shellcheck from the first draft; it found the one bug that
   would have silently mis-detected Windows.*
2. **Verification ran against system runtimes.**
   mise was on PATH (brew) but its activation had never been sourced, so
   `node -v` returned v24 and `java` was absent — the script "failed" on a
   perfectly good machine, and worse, `npm install` used system npm.
   Fix: always `eval "$(mise activate bash)"` in the script's own shell after
   mise is confirmed present. *Lesson: a setup script must control its own
   environment; never assume the caller's shell is activated.*
3. **Java version matching was wrong twice.**
   a) `java -version 2>&1 | head -1 || echo none` — with `pipefail`, when the
      pipeline's exit was non-zero the `|| echo none` appended a second line,
      corrupting the captured string.
   b) Matching the literal pin string `temurin-21` against the version line
      `openjdk version "21.0.12.1"` — the vendor name never appears there.
   Fix: extract the major version with `sed` and compare majors
   (`want_java_major="${want_java##*-}"`). *Lesson: parse version output
   structurally (major/minor), never substring-match human-readable banners;
   and remember `pipefail` changes the semantics of `cmd || fallback` in
   command substitutions.*
4. **Misleading failure message on install failure.**
   When the mise install itself failed (no brew), the follow-up check still
   printed "mise installed but not on PATH". Fix: set
   `MISE_INSTALLED_BY_US=1` only on successful install. *Lesson: track
   "what actually happened" in state, not "what we attempted".*
5. **Unused variable** (`MISE_WAS_ON_PATH`) — shellcheck SC2034. Removed.

## What worked well

- **Testing on the real machine first** caught bugs #1–#4; none would have
  survived a "looks right" review. The simulated-fresh-machine runs
  (T3/T4/T5) are cheap (`env PATH=... HOME=... bash ...`) and worth keeping
  as a manual regression ritual.
- **Idempotency by construction**: every step checks state before acting
  (installed? exists? running?), so re-runs are safe and the same script
  serves "first run" and "fix a broken setup".
- **The summary block** (ok/warn/fail per step + counts + exit code) makes the
  script's result greppable and reportable — developers can paste the tail of
  the output into a PR or issue and it's self-explanatory.
- **Warn-vs-fail discipline**: Postgres missing is a warning (setup continues,
  user is pointed to SETUP.md); missing git/curl/mise are failures (nothing
  else can work). Choosing this per step was the main design work.

## Unverified / known gaps

- **Windows was never executed.** The winget branch, Git Bash activation, and
  `mvnw.cmd` behavior are written from mise docs, not tested. First Windows
  developer to run it should report back; consider a `# Windows: tested
  2026-XX-XX by @name` comment when that happens.
- **Linux** is not a target per the request, but the script would mostly work
  (brew missing → it suggests `curl https://mise.run | sh`, which *does*
  support Linux). If Linux support is wanted later, add an apt/distro branch
  or just document the curl installer.
- **mise installed via brew in the same run**: after `brew install mise`, the
  script relies on `maybe_activate_mise` sourcing the rc file to find the
  binary. If the brew install doesn't land on PATH immediately (rare), the
  user gets "open a new terminal and re-run" — acceptable, but the fresh-
  terminal re-run is the one friction point left.
- **Postgres is checked, not installed** (deliberate). If onboarding friction
  is high, a later iteration could offer `brew install postgresql@14` on
  macOS with explicit opt-in (never silently start a service).
- **No network-failure retry.** A flaky `npm install` fails the run; re-run
  fixes it. Fine for v1.

## Recommendations for future scripting in this project (and similar stacks)

1. **shellcheck is non-negotiable** — it found the Windows-detection bug that
   would have shipped. Add it to the pre-commit hook or CI for `*.sh`.
2. **Test matrix to run before declaring a setup script done:**
   - normal re-run (idempotency)
   - stripped-PATH run (fresh shell)
   - fake-HOME run (truly fresh machine)
   - wrong-directory run
   - (and on each OS the script claims to support)
3. **Prefer "detect + point to docs" over "install everything"** for
   interactive or service-y components (Postgres, IDEs). Runtimes are the
   right thing to automate; daemons are not.
4. **Keep one source of truth for versions** (`.tool-versions`) and have the
   script *read* the pins from it instead of hardcoding — the script already
   does this, keep it that way when adding runtimes.
5. **State what the script does NOT do** in its header (it doesn't install
   Postgres, doesn't touch system runtimes, doesn't overwrite `.env`) — this
   is what prevents the "why did it do that / why didn't it" tickets.
6. **Version the script's behavior in the log, not just the code.** This file
   records *why* each failure happened; that's the part git history doesn't
   capture well.
