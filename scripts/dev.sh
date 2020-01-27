#! /usr/bin/env bash

# Exit in case of error
set -e

DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker-compose up --build
