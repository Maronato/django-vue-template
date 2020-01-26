#! /usr/bin/env bash

# Exit in case of error
set -e

source '.env'

DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker-compose -p ${PROJECT_NAME} up --build
