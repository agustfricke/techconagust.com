from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.utils import timezone

class CustomUserManager(UserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('You must privided a valid email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email           = models.EmailField(blank=False, unique=True)
    username        = models.CharField( max_length=50)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    bio             = models.TextField(blank=True)
    avatar          = models.ImageField(default='avatar.jpg', upload_to='users')
    premium         = models.BooleanField(default=False)

    is_active       = models.BooleanField(default=True)
    is_superuser    = models.BooleanField(default=False)
    is_staff        = models.BooleanField(default=False)

    date_joind      = models.DateTimeField(default=timezone.now)

    objects         = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELD = ['user_name', 'first_name']



