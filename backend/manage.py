#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

import ptvsd

DEBUG = os.environ.get("DEBUG", "True").capitalize() == "True"

if DEBUG and os.environ.get("RUN_MAIN") or os.environ.get("WERKZEUG_RUN_MAIN"):
    print("Enabling vsc attachment")
    ptvsd.enable_attach(address=("0.0.0.0", 7913))
    print("vsc attachment enabled")


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
