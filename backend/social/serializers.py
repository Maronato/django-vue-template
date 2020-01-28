from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_auth.registration.serializers import SocialAccountSerializer


class UserDetailsSerializer(serializers.ModelSerializer):

    accounts = SocialAccountSerializer(source="socialaccount_set", many=True)

    class Meta:
        model = get_user_model()
        fields = ("username", "email", "first_name", "last_name", "accounts")
