from django.urls import path, include
from rest_auth.registration.views import SocialAccountDisconnectView
from .views import GoogleLogin, GoogleConnect

app_name = "social"

connect_urlpatterns = [path("google/", GoogleConnect.as_view(), name="google")]

login_urlpatterns = [path("google/", GoogleLogin.as_view(), name="google")]

urlpatterns = [
    # URLs to connect a social account to an **existing** user
    path("connect/", include((connect_urlpatterns, "social"), namespace="connect")),
    # URLs to sign up or login an user with a social login
    path("login/", include((login_urlpatterns, "social"), namespace="login")),
    # Disconnect an account from the user
    path("disconnect/:id/", SocialAccountDisconnectView.as_view(), name="disconnect"),
]
