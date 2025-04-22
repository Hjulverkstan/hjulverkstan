#!/bin/bash

# Prompt for username
read -p "Enter the new username: " USERNAME

# Create the user and their home directory
sudo adduser "$USERNAME"

# Create the .ssh directory
sudo mkdir -p /home/"$USERNAME"/.ssh
sudo chmod 700 /home/"$USERNAME"/.ssh
sudo chown "$USERNAME":"$USERNAME" /home/"$USERNAME"/.ssh

# Prompt for SSH key(s)
echo "Paste the SSH public key(s) for $USERNAME (press ENTER when done):"
echo "(To enter multiple keys, paste them all and press CTRL+D when finished)"
SSH_KEYS=$(</dev/stdin)

# Write to authorized_keys
echo "$SSH_KEYS" | sudo tee /home/"$USERNAME"/.ssh/authorized_keys > /dev/null
sudo chmod 600 /home/"$USERNAME"/.ssh/authorized_keys
sudo chown "$USERNAME":"$USERNAME" /home/"$USERNAME"/.ssh/authorized_keys

# Add user to groups
sudo usermod -aG adm "$USERNAME"
sudo usermod -aG wheel "$USERNAME"
sudo usermod -aG systemd-journal "$USERNAME"
sudo usermod -aG docker "$USERNAME"

# Give passwordless sudo privileges
d

sudo chmod 440 /etc/sudoers.d/"$USERNAME"

echo "✅   User '$USERNAME' has been created and configured with:"
echo "     • SSH access"
echo "     • Group memberships: adm, wheel, systemd-journal, docker"
echo "     • Passwordless sudo access"