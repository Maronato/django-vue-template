# Django + Vue Template

This template uses Django as the API backend and Vue (with Nuxt) as the Frontend. It also comes preloaded with lots of other services and is production-ready.

## What can this template do for me?
Django is a beautiful framework for developing websites, but creating frontends with it feels like the 90's. At the same time, it can be tiresome to develop backends using Node because it comes with zero tools to help you setup database access, authentication, etc.

This template helps you by integrating Vue and Django pretty well so you can use the best of both worlds to accomplish your tasks.

It also comes with built-in support for social and password authentication that saves your users inside Django and allows your frontend to authenticate using JWT.

Development is made easier through the use of Docker containers and, when you are ready to deploy, everything is wrapped with with Docker Swarm, Traefik and Portainer so your project is fully scalable and production-ready from the start.

- [Django + Vue Template](#django--vue-template)
  - [What can this template do for me?](#what-can-this-template-do-for-me)
- [Features](#features)
- [Development](#development)
  - [Requirements](#requirements)
  - [Configure the environment](#configure-the-environment)
  - [Updating the `/etc/hosts` file](#updating-the-etchosts-file)
  - [Starting the development server](#starting-the-development-server)
  - [Stopping the development server](#stopping-the-development-server)
  - [Custom VS Code tasks](#custom-vs-code-tasks)
- [Setting up Social Providers](#setting-up-social-providers)
  - [Setting up Google Auth](#setting-up-google-auth)
  - [Setting up other social providers](#setting-up-other-social-providers)
    - [1. Setup allauth to recognize the provider](#1-setup-allauth-to-recognize-the-provider)
    - [2. Create the REST login and connect views to allow communication with Vue](#2-create-the-rest-login-and-connect-views-to-allow-communication-with-vue)
    - [3. Register the new urls on the backend](#3-register-the-new-urls-on-the-backend)
    - [4. Add the provider client and secret keys to Django's database](#4-add-the-provider-client-and-secret-keys-to-djangos-database)
    - [5. Add the provider client and secret keys to `social-provider.secrets`](#5-add-the-provider-client-and-secret-keys-to-social-providersecrets)
    - [6. Add the provider to the Nuxt configuration](#6-add-the-provider-to-the-nuxt-configuration)
      - [Creating a new `_provider`](#creating-a-new-provider)
      - [Without creating a new `_provider`](#without-creating-a-new-provider)
- [Login, logout and making requests as the user](#login-logout-and-making-requests-as-the-user)
- [In Production](#in-production)
  - [Deploying](#deploying)
    - [Using Docker Hub](#using-docker-hub)
    - [Without Docker Hub](#without-docker-hub)
  - [Now what?](#now-what)
  - [Extra services](#extra-services)

# Features
- Easy development and deployment with custom scripts
- Pre-configured debug settings and tasks for VS Code
- Fast and async Django backend with [uvicorn](https://www.uvicorn.org/)
- Complete Vue Frontend with [Nuxt](https://nuxtjs.org/)
- PWA support with [Nuxt PWA](https://pwa.nuxtjs.org/)
- Universal Server Side Rendering (SSR)
- Server Worker with [Celery](http://www.celeryproject.org/)
- Social and password authentication with [Django Allauth](https://django-allauth.readthedocs.io/en/latest/)
- [Docker Swarm](https://docs.docker.com/engine/swarm/)-ready
- Edge Routing and Load Balancing with [Traefik](https://docs.traefik.io/)
- Metrics and health dashboards with [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/)
- Container Management with [Portainer](https://www.portainer.io/)
- Powerful relational and in-memory databases with [Postgres](https://www.postgresql.org/) and [Redis](https://redis.io/)


# Development
To start developing you'll need to install some things:

## Requirements
- [Docker v19+](https://www.docker.com/)
- [Docker Compose v1.25+](https://docs.docker.com/compose/)

I recommend you use [VS Code](https://code.visualstudio.com/) as your editor, since it allows for easy debugging and has some nice features to help you during development

## Configure the environment
Before you can begin, you must setup some variables.

Navigate to the root folder of the project and edit the following files with your preferred settings. The default values should be fine, though
- `env-backend.env`
- `env-dev.env`
- `env-postgres.env`

Now you'll setup your secrets. Make a copy of the following files, renaming the copies without the `.template` (e.g. `django.template.secrets` becomes `django.secrets`)
- `django.template.secrets`
- `social-provider.secrets`

For the `social-provider.secrets`, you'll probably want to grab some Google OAuth2 Credentials. You can follow this [tutorial](https://theonetechnologies.com/blog/post/how-to-get-google-app-client-id-and-client-secret) to learn how.

Feel free to add credentials for more services if you want.

## Updating the `/etc/hosts` file
In production this template makes services available using subdomains. To reproduce this behavior when testing, you'll need to make sure that you computer understands subdomains on `localhost`. If you are using Chrome to develop then you are probably good to go, but otherwise you might want to configure your `/etc/hosts` to accept subdomains on `localhost`

If you don't know how to edit your `/etc/hosts` file, follow this [tutorial](https://www.howtogeek.com/howto/27350/beginner-geek-how-to-edit-your-hosts-file/)

You'll need to add the following yo it:
```
# Generic stack testing Mappings
127.0.0.1 traefik.localhost
127.0.0.1 api.localhost
# End of section
```

## Starting the development server
To launch all dev servers at once, go to the project root and run:
```
./scripts/dev.sh
```

> You can also use VS Code's [task](https://code.visualstudio.com/docs/editor/tasks) `Dev Up` to launch the dev server.

This will build all of the required images and deploy the containers.

It may take some time to launch it for the first time, but sequential launches should be pretty fast.

> **Attention** The first time you run it, Django might be too fast and attempt to migrate before Postgres is ready. If that happens, simply [stop the dev server](#stopping-the-development-server) and try again.

These are your development urls:

| URL                                                        | Service            | Description                                                                           |
| ---------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------- |
| [`http://localhost`](http://localhost)                     | Frontend           | Frontend of your project.                                                             |
| [`http://api.localhost/admin`](http://api.localhost/admin) | Backend Admin page | Admin page of the backend and API of your project                                     |
| [`http://traefik.localhost`](http://traefik.localhost)     | Traefik            | "Edge router" that makes it possible to use subdomains and load balance your services |

Keep in mind that you still need to finish setting up Social auth to use it. Everything else is ready to go, including Hot Reloading of your code on both the backend and frontend.

## Stopping the development server
To stop, press `ctrl + c` on the terminal running the project.

You can also type `docker-compose down` from the root folder of your project.

## Custom VS Code tasks
If you are using VS Code there are some custom tasks you can use
- `Dev Up`: Starts the development servers
- `Dev Down`: Stops the development servers
- `Open backend shell`: Executes `python manage.py shell` inside the backend. (Actually its `shell_plus` from [django-extensions](https://django-extensions.readthedocs.io/en/latest/installation_instructions.html))
- `Restart Backend`: Restarts the backend instances
- `Restart Frontend`: Restarts the frontend instances

# Setting up Social Providers
This template uses [Django allauth](https://django-allauth.readthedocs.io/en/latest/overview.html) and [Django Rest Auth](https://django-rest-auth.readthedocs.io/en/latest/introduction.html) on the backend for social auth. On the frontend it uses [Nuxt Auth](https://auth.nuxtjs.org/) with a custom provider.

If you need to modify the auth process, read the documentation of those libraries to learn how. Here I'll give an overview of what you'll need to do.

## Setting up Google Auth
Google auth is mostly setup. All you need to do is create the provider instance on the Django Admin page.

To do so:
- open up your backend on [`http://api.localhost`](http://api.localhost) or wherever it is
- login using your superuser account (defined in your `env-backend.env` file)
- click on **Social Application**
- click on **Add Social Application**
- Select `Google` as the *Provider*
- use `Google` as the *Name* 
- fill your client ID and secret
- Finally, click on **Choose all** under the *Sites* box to add the provider to all sites. Don't worry if the site name is `example.com`
- Save

That's it. You can now use your Google account to sign up and sign in

> **Note**: You'll need to do this both on your dev server and prod server as they do not share databases.

## Setting up other social providers
Not all providers are created equal, but most should follow the same steps to setup.

On the **backend** you'll need to:
1. Setup allauth to recognize the provider
2. Create the REST login and connect views to allow communication with Vue
3. Register the new urls on the backend
4. Add the provider client and secret keys to Django's database
  
On the **frontend** you'll need to:

5. Add the provider client and secret keys to `social-provider.secrets`
6. Add the provider to the Nuxt configuration

I'll go through all of those one by one

### 1. Setup allauth to recognize the provider
First you'll need to enable the provider. To do so, add the required provider to the list of `INSTALLED_APPS` on your `settings.py`.

It should look like: `'allauth.socialaccount.providers.facebook'`

> The full list can be found [here](https://django-allauth.readthedocs.io/en/latest/installation.html)

Then, checkout the specifics of your provider [on allauth's docs](https://django-allauth.readthedocs.io/en/latest/providers.html). Some providers require special configs to be added to `settings.py`

### 2. Create the REST login and connect views to allow communication with Vue
You'll now need to create a REST view because allauth cannot natively communicate through REST.

Go to `backend/social/views.py` and follow the example from Google.

This is also well documented on [Django Rest Auth](https://django-rest-auth.readthedocs.io/en/latest/installation.html#social-authentication-optional)'s page about it.

**Attention**: Since our backend only receives the `code`, you'll need to add the extra property `client_class = OAuth2Client` to your provider views.

Example for the Facebook Provider:
```python
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter

class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter
    permission_classes = (AllowAny,)
    callback_url = f'{os.environ.get("FRONTEND_URL")}/login/callback'
    client_class = OAuth2Client


class FacebookConnect(SocialConnectView):
    adapter_class = FacebookOAuth2Adapter
    callback_url = f'{os.environ.get("FRONTEND_URL")}/login/callback'
    client_class = OAuth2Client
```

### 3. Register the new urls on the backend
Go to `backend/social/urls.py` and edit it to import your new provider views from `.views`.

Add them to `connect_urlpatterns` and `login_urlpatterns` following the Google provider examples.

### 4. Add the provider client and secret keys to Django's database
With your development or production server deployed:
- open up your backend on [`http://api.localhost`](http://api.localhost) or wherever it is
- login using your superuser account (defined in your `env-backend.env` file)
- click on **Social Application**
- click on **Add Social Application**
- Select your new provider as the *Provider*
- use your provider's name (e.g. Facebook) as the *Name* 
- fill your client ID and secret
- Finally, click on **Choose all** under the *Sites* box to add the provider to all sites. Don't worry if the site name is `example.com`
- Save

### 5. Add the provider client and secret keys to `social-provider.secrets`
Simply open `social-provider.secrets` and edit it adding your provider's info.

### 6. Add the provider to the Nuxt configuration
Open `/frontend/nuxt.config.js`.

Scroll until you find the `auth` key on the config object and look for it's `strategies` property. It should at least have the `google` key with its configuration.

At this point you have two options. You can either create a `_provider` for your new provider strategy, or you can configure it all right on `nuxt.config.js`.

#### Creating a new `_provider`
This makes things a little more organized, but is completely optional.

You'll need to create a new file on `frontend/plugins/auth/providers` with your provider's name.

You can follow the example on `google.js`, but its format should be something like:
```js
const { assignDefaults } = require('@nuxtjs/auth/lib/providers/_utils')

// Change to your provider's name
module.exports = function <YourProvider>(strategy) {
  assignDefaults(strategy, {
    // Required
    _scheme: '~/plugins/auth/scheme/social.js',

    // Add your provider's authorization endpoint
    authorization_endpoint: 'https://accounts.google.com/o/oauth2/auth',
    
    // Don't need to change this
    userinfo_endpoint: '/auth/user/',

    // Update with the name of the url you registered on step 3
    login_endpoint: '/auth/social/login/<your-provider>/',
    connect_endpoint: '/auth/social/connect/<your-provider>/',

    // Add which scopes you'll want by default
    scope: ['openid', 'profile', 'email']
  })
}
```

Then you can go back to `nuxt.config.js` and add it to the list of `strategies` following the google example.

To fill the `client_id` value, use the `socialProviderSecrets` object. It is created from the values on `social-provider.secrets`.

#### Without creating a new `_provider`

Just add it to the list of `strategies`. It should look like:
```js
{
  strategies: {
    // ...
    yourProvider: {
      // Required
      _scheme: '~/plugins/auth/scheme/social.js',

      // Add your provider's authorization endpoint
      authorization_endpoint: 'https://accounts.google.com/o/oauth2/auth',
      
      // Don't need to change this
      userinfo_endpoint: '/auth/user/',

      // Update with the name of the url you registered on step 3
      login_endpoint: '/auth/social/login/<your-provider>/',
      connect_endpoint: '/auth/social/connect/<your-provider>/',

      // Add which scopes you'll want by default
      scope: ['openid', 'profile', 'email'],

      // Your provider's client_id from social-provider.secrets
      client_id: socialProviderSecrets.YOUR_PROVIDER_CLIENT_ID
    }
  }
}
```

# Login, logout and making requests as the user
Login on the frontend is managed by [Nuxt Auth](https://auth.nuxtjs.org/). I recommend you read more about it before going on.

Your most used commands will be:
```js
// Log in using a specific social provider (e.g. 'google')
this.$auth.loginWith(yourProvider)

// Logout
this.$auth.logout()

// Check if the user is logged in
this.$auth.loggedIn

// With a user logged in, make a request to the backend with their credentials (uses axios behind the scenes)
this.$auth.request(axiosRequestParams)

// With a user logged in, connect another social account to that user
this.$auth.connect(providerToConnect)

// With the user logged in, get their data
this.$auth.user

// With the user logged in, get their connected accounts
this.$auth.user.accounts

// With a user logged in, disconnect an account
// (Get the account id from this.$auth.user.accounts)
this.$auth.disconnect(accountId)
```

# In Production
This template is also production-ready with deployment scripts and more.

## Deploying
Before you deploy your app to the world, you'll need to configure some more things.

I recommend you use [Docker Hub](https://hub.docker.com/) to make updating your production environment easier down the line, but you can also build your images on the production computers if you prefer.

### Using Docker Hub
**On your development computer**, open `env-prod.env` and fill it up with your information.

Now you'll need to build your project onto images. To do so, just run
```
./scripts/build.sh
```

This will do 2 things:
- Create two `docker-stack` files that'll you'll use to setup your production environment
- Actually build the images

Once your images are built, you may push them to Docker Hub with
```
./scripts/push.sh
```

**On your production machine**, get the following files transferred or copied from your development computer:
- `docker-stack-prod.yml` (or `latest`, your choice)
- `django.secrets` filled with your production secrets
- `social-provider.secrets` filled with your production secrets
- `.env` with your production settings
- `env-prod.env` with your production settings
- the `scripts` folder (at least `cloud_setup.sh` and `deploy.sh`)

Now you have everything you need.

Run:
```bash
# This assumes that your production machine is running Ubuntu
# Modify it with the correct package managers if it is not
./scripts/cloud_setup.sh
```
This will install Docker, Docker Compose ask you some questions and, then, deploy your whole project architecture using Docker Swarm

### Without Docker Hub
If you do not want to use Docker Hub, you'll need to clone your project repository onto your production machine.

After that make sure that your environment variables and secrets are all updated with production values.

The you'll need to build your project. To do so, run
```
./scripts/build.sh
```
And then run the setup:
```bash
# This assumes that your production machine is running Ubuntu
# Modify it with the correct package managers if it is not
./scripts/cloud_setup.sh
```
This will install Docker, Docker Compose ask you some questions and, then, deploy your whole project architecture using Docker Swarm

## Now what?
Assuming everything went ok and you also have a valid domain pointing to your server, you'll be able to access your services through it.

First go to `https://traefik.<your-domain>` and make sure everything is ok with TLS fully working.

If so, you'll need to register the social accounts to the backend like you did before. Check out the [instructions](#4-add-the-provider-client-and-secret-keys-to-djangos-database) to remember how.

Now everything should be working fine!

## Extra services
If you set the `USE_EXTRA` on the `env-prod.env` file to `true`, then you'll have some more services available.

| URL                                | Service            | Description                                                                                  |
| ---------------------------------- | ------------------ | -------------------------------------------------------------------------------------------- |
| `https://<your-domain>`            | Frontend           | Frontend of your project.                                                                    |
| `https://api.<your-domain>/admin`  | Backend Admin page | Admin page of the backend and API of your project                                            |
| `https://traefik.<your-domain>`    | Traefik            | "Edge router" that makes it possible to use subdomains and load balance your services        |
| `https://portainer.<your-domain>`  | Portainer          | Container management service to manage all of your service                                   |
| `https://grafana.<your-domain>`    | Grafana            | Observability tool with lots of dashboards showing info about your project                   |
| `https://prometheus.<your-domain>` | Prometheus         | Metrics aggregator that fetches data from other services and makes them available to Grafana |
