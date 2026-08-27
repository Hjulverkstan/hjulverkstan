# Sandbox: runtimes with mise

This project needs two runtimes:

| Runtime | Version | Used by |
| ------- | ------- | ------- |
| Node.js | 22      | `web/`, `cdk/` |
| Java    | 21 (Temurin) | `api/` (Maven) |

These are the same versions CI runs (see `.github/workflows/`). Instead of installing them system-wide, we pin them with **[mise](https://mise.jdx.dev/)** — a single tool that downloads the exact runtimes into your user directory (`~/.local/share/mise/installs`), no admin rights needed, and switches them on automatically when you are inside this repository.

Everything about the versions lives in [`.tool-versions`](.tool-versions) at the repo root. If that file changes, you only need to run `mise install` again — nothing else.

## 1. Install mise

Pick your operating system. One command is enough.

### macOS / Linux

```bash
curl https://mise.run | sh
```

(On macOS you can also use `brew install mise`.)

### Windows

In **PowerShell**:

```powershell
irm https://mise.run | iex
```

(Alternatively: `winget install jdx.mise`.)

> **Windows note:** do all the following steps in the same kind of shell you use for development — PowerShell or Git Bash. mise activates per shell, so pick one and stick with it.

The installer adds an activation line to your shell config (`.zshrc` / `.bashrc` / PowerShell profile). **Open a new terminal** so it takes effect, then verify:

```bash
mise --version
```

## 2. Install the pinned runtimes

From the repository root:

```bash
mise trust
mise install
```

- `mise trust` marks the `.tool-versions` file as safe to act on (one-time, per machine).
- `mise install` downloads Node 22 and Temurin JDK 21 into `~/.local/share/mise/installs`. This takes a minute or two on first run; afterwards it is instant.

## 3. Verify

In a terminal **inside the repository**:

```bash
node -v        # v22.x
java -version  # openjdk version "21..."
cd api && ./mvnw -version   # "Java version: 21..." (on Windows: mvnw.cmd -version)
```

If `node -v` shows a different major version, your shell is not activated — open a new terminal and try again. Outside the repository directory, your system Node/Java (if any) are untouched: the sandbox only applies here.

## Day-to-day

Nothing. mise is invisible:

- `cd` into the repo → Node 22 + Java 21 are on your `PATH`.
- `cd` elsewhere → back to your system runtimes.
- `.tool-versions` changes in a PR → run `mise install` once.

Useful commands when you actually need them:

```bash
mise ls          # what is installed and what the repo pins
mise where java  # where the JDK lives (see below)
mise uninstall --all   # remove everything mise installed (safe, repo untouched)
```

## IDEs

- **IntelliJ IDEA:** if it cannot find a JDK, point it at the path from `mise where java`. On macOS you can also make the JDK visible system-wide (optional, needs `sudo`):

  ```bash
  JDK=$(mise where java)
  sudo mkdir -p "/Library/Java/JavaVirtualMachines/$(basename "$JDK").jdk"
  sudo ln -s "$JDK/Contents" "/Library/Java/JavaVirtualMachines/$(basename "$JDK").jdk/Contents"
  ```

- **VS Code:** install the [Mise VSCode extension](https://marketplace.visualstudio.com/items?itemName=hverlin.mise-vscode) so the integrated terminal and Java/Node tooling pick up the pinned versions.

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| `mise: command not found` | Open a new terminal. If it persists, the activation line is missing from your shell config — re-run the installer from step 1. |
| `node -v` shows the wrong version in the repo | Same as above: the shell is not activated. New terminal. |
| `mise trust` says the file is already trusted | Fine, skip to `mise install`. |
| Windows: `mvnw` not executable | Use `mvnw.cmd` in PowerShell, or run through Git Bash. |
| Something is broken and you want a clean slate | `mise uninstall --all`, then repeat steps 2–3. |

## Why mise and not nvm / winget / apt?

- One tool for **all** runtimes (today Node + Java, tomorrow anything else) instead of one manager per language.
- Versions are committed in `.tool-versions`, so every developer — and every new intern — gets byte-identical runtimes to CI without reading install guides.
- Installs live in your user directory: no `sudo`, no polluting the system, easy to remove.
