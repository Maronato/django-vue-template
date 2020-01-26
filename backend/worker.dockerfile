# Load environment
ARG APP_ENV=dev
FROM python:3.8.1-alpine as base

# Configure environment
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
# Create venv
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Preinstall commands
FROM base as preinstall

RUN \
    apk update \
    apk add --no-cache postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev linux-headers libffi-dev openssl-dev python3-dev make libc-dev git

# Running global install
FROM preinstall as install

# Set Workdir, copy app and install python dependencies
WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

# Prod postinstall
FROM install as prod-postinstall

COPY ./ /app/

# Dev Postinstall
FROM install as dev-postinstall

# Cleanup stage
FROM ${APP_ENV}-postinstall as cleanup

# Cleanup
RUN \
    apk --purge del .build-deps && \
    rm -rf requirements.txt docker-entrypoint.sh

# Dev pre final stage
FROM python:3.8.1-alpine as dev-prefinal

# Prod pre final stage
FROM python:3.8.1-alpine as prod-prefinal

COPY --from=cleanup /app/ /app/

# Final stage
FROM ${APP_ENV}-prefinal as final

WORKDIR /app
COPY --from=cleanup /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN apk add --no-cache postgresql-libs

# Configure environment
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Prepare entrypoint
COPY worker-entrypoint.sh /docker-entrypoint.sh
RUN chmod a+x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
