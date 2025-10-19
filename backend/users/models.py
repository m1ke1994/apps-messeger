from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=32, unique=True, blank=True, null=True)

    def __str__(self):
        return self.username or (self.phone or f"user:{self.pk}")
