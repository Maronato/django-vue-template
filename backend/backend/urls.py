"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from django.http import HttpResponse
from django.views import View

from rest_framework_simplejwt.views import TokenRefreshView


api_auth_urlpatterns = [
    path("social/", include("social.urls", namespace="social")),
    path("", include("rest_auth.urls")),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]


api_urlpatterns = [
    path("auth/", include((api_auth_urlpatterns, "backend"), namespace="auth")),
]


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include((api_urlpatterns, "backend-auth"), namespace="api")),
    path("connection_error/", View.as_view(), name="socialaccount_connections"),
    path("", include("django_prometheus.urls")),
]
