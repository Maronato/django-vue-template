#!/bin/sh
# Install dependencies on local machine
echo "Installing dev dependencies from yarn"
yarn
echo "Done! Executing command"
exec "$@"
