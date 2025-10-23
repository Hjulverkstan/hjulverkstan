#!/usr/bin/env bash
set -euo pipefail

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

# --- Install Docker Compose v2 plugin (latest v2.x) ---
arch="$(uname -m)"
case "$arch" in
  x86_64)  comp_arch="x86_64" ;;
  aarch64|arm64) comp_arch="aarch64" ;;
  *) echo "Unsupported arch: $arch"; exit 1 ;;
esac

sudo mkdir -p /usr/local/lib/docker/cli-plugins

compose_tag="$(
  curl -fsSL 'https://api.github.com/repos/docker/compose/releases?per_page=1' \
    | grep -o '"tag_name":\s*"v2[^"]*' | sed 's/.*"//'
)"
: "${compose_tag:=v2.29.7}"  # fallback if GitHub API is rate-limited

sudo curl -fsSL \
  "https://github.com/docker/compose/releases/download/${compose_tag}/docker-compose-linux-${comp_arch}" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# --- Verify ---
docker --version
docker compose version