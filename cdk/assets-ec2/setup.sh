#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="/var/log/setup.log"

# Log to both console and file, with timestamps
mkdir -p "$(dirname "$LOG_FILE")"
exec > >(awk '{ print strftime("[%Y-%m-%d %H:%M:%S]"), $0 }' | tee -a "$LOG_FILE") 2>&1

on_error() {
  local exit_code=$?
  echo "ERROR: setup.sh failed (exit_code=$exit_code) at line $1"
  echo "Last command: ${BASH_COMMAND:-unknown}"
  echo "Log file: $LOG_FILE"
  exit "$exit_code"
}
trap 'on_error $LINENO' ERR

echo "=== setup.sh starting ==="
echo "User: $(whoami)"
echo "Kernel: $(uname -a)"
echo "Working dir: $(pwd)"
echo "PATH: $PATH"

# Print commands after logging is configured
set -x

# --- Clean out any Docker CE leftovers (safe if none) ---
sudo systemctl stop docker || true
sudo rm -f /etc/yum.repos.d/docker-ce.repo || true
sudo dnf -y remove \
  'docker-ce*' docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras || true
sudo dnf clean all -y
sudo rm -rf /var/cache/dnf

# --- Install AWS-packaged Docker + nightly auto updates ---
sudo dnf -y update
sudo dnf -y install docker dnf-automatic

# Apply unit changes & enable services
sudo systemctl daemon-reload || true
sudo systemctl enable --now docker dnf-automatic.timer

echo "Installing docker compose (latest stable v2)..."

sudo mkdir -p /usr/local/lib/docker/cli-plugins

arch="$(uname -m)"
case "$arch" in
  x86_64)  comp_arch="x86_64" ;;
  aarch64|arm64) comp_arch="aarch64" ;;
  *) echo "Unsupported arch: $arch"; exit 1 ;;
esac

sudo curl -fsSL \
  "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-${comp_arch}" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose

sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

echo "Docker compose installed:"
docker compose version

# --- Verify ---
echo "Verifying docker installation..."
docker --version

echo "Verifying docker compose plugin..."
# Show where docker looks for plugins (useful if PATH issues)
ls -la /usr/local/lib/docker/cli-plugins || true
docker compose version

# --- Configure Docker Build Engine ---
# We use the legacy build engine (DOCKER_BUILDKIT=0) to avoid installing
# the additional Buildx plugin on Amazon Linux 2023.
echo "Configuring environment to use legacy Docker build engine..."

# Create a profile script so this applies to all users upon login
echo 'export DOCKER_BUILDKIT=0' | sudo tee /etc/profile.d/docker-build.sh
echo 'export COMPOSE_DOCKER_CLI_BUILD=0' | sudo tee -a /etc/profile.d/docker-build.sh
sudo chmod +x /etc/profile.d/docker-build.sh

# Apply variables to the current shell session immediately
export DOCKER_BUILDKIT=0
export COMPOSE_DOCKER_CLI_BUILD=0

echo "=== setup.sh completed successfully ==="
echo "Log file: $LOG_FILE"