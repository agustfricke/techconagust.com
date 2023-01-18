from rest_framework import serializers
from djoser.serializers import UserCreateSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'username', 'name', 'password')


class UserSerializer(serializers.ModelSerializer):
    is_superuser = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_superuser', 'bio', 'name', 'avatar', 'premium']

    def get_is_superuser(self, obj):
        return obj.is_staff


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'name',
                  'email', 'is_superuser', 'token', 'bio', 'avatar', 'premium']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)




