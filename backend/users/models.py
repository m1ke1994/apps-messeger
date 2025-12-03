from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=32, unique=True, blank=True, null=True)
    telegram_chat_id = models.BigIntegerField(blank=True, null=True, unique=True)
    display_name = models.CharField(max_length=255, blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    skills = models.JSONField(default=list, blank=True)
    education = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.username or (self.phone or f"user:{self.pk}")

    @property
    def avatar_url(self) -> str | None:
        if self.avatar and hasattr(self.avatar, "url"):
            return self.avatar.url
        return None
