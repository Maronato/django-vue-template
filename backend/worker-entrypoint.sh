#!/bin/sh
rm -f *.pid celerybeat-schedule
exec "$@"
