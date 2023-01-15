from rest_framework import serializers
from djoser.serializers import UserCreateSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'last_name', 'password')


class UserSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_admin', 'bio', 'name', 'image', 'premium']

    def get_is_admin(self, obj):
        return obj.is_staff


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'name',
                  'email', 'is_admin', 'token', 'bio', 'image', 'premium']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)




