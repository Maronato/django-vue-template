#! /usr/bin/env bash

# Exit in case of error
set -e

source 'env-prod.env'
source '.env'

docker stack deploy -c docker-stack-${TAG}.yml --with-registry-auth ${STACK_NAME}
