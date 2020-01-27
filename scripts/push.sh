#! /usr/bin/env bash

# Exit in case of error
set -e

source 'env-dev.env'
source '.env'


DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker-compose -f docker-stack-${TAG}.yml push
