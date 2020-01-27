#! /usr/bin/env bash

# Exit in case of error
set -e

source 'env-prod.env'

echo " Installing Docker..."
# Install docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-cache policy docker-ce
apt-get install -y docker-ce
apt install -y apache2-utils
echo " Done!"

echo " Installing Docker Compose..."
# Install compose
curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
docker-compose --version
echo " Done!"

# Get env vars
echo "What is the Traefik username?"
read TRAEFIK_USER
echo "What is the Traefik password?"
read TRAEFIK_PASS
htpasswd -nb "$TRAEFIK_USER" "$TRAEFIK_PASS" > traefik_users

if [ "$USE_EXTRA" = true ]; then
    echo "What is the Grafana password (for the user 'admin')?"
    read GRAFANA_PASS
    echo "$GRAFANA_PASS" > grafana_password
fi

echo " Generating stack files..."
# Generate the stack file
./scripts/generate-stack.sh

echo " Setting up Docker Swarm..."
# Get IP
IP=$(curl http://checkip.amazonaws.com)
# Initialize swarm
docker swarm init --advertise-addr $IP || true
# Create the proxy network
docker network create -d overlay --attachable proxy || true

echo " Creating acme.json..."
# Create acme file
touch acme.json
chmod 600 acme.json

echo " Deploying stack"
./scripts/deploy.sh
