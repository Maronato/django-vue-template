import os
from rest_framework.permissions import AllowAny
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from rest_auth.registration.views import SocialLoginView, SocialConnectView


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    permission_classes = (AllowAny,)
    callback_url = f'{os.environ.get("FRONTEND_URL")}/login/callback'
    client_class = OAuth2Client


class GoogleConnect(SocialConnectView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = f'{os.environ.get("FRONTEND_URL")}/login/callback'
    client_class = OAuth2Client
