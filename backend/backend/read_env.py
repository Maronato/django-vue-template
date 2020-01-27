import os
import re


class EnvironmentVariables(object):
    def __init__(self):
        self._values = {}

    def set(self, key, value):
        self._values[key] = value

    def get(self, key, default=None):
        return self._values.get(key, default)


def read_env(path, filename):
    """Pulled from Honcho code with minor updates, reads local default
    environment variables from an environment file
    """

    filePath = os.path.join(path, filename)

    try:
        with open(filePath) as f:
            content = f.read()
    except IOError:
        content = ""

    environment_variables = EnvironmentVariables()

    for line in content.splitlines():
        m1 = re.match(r"\A([A-Za-z_0-9]+)=(.*)\Z", line)
        if m1:
            key, val = m1.group(1), m1.group(2)
            m2 = re.match(r"\A'(.*)'\Z", val)
            if m2:
                val = m2.group(1)
            m3 = re.match(r'\A"(.*)"\Z', val)
            if m3:
                val = re.sub(r"\\(.)", r"\1", m3.group(1))
            if val.strip() != "":
                environment_variables.set(key, val.strip())

    return environment_variables
