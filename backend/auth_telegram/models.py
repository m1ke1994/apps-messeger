from django.db import models
from django.utils import timezone
from datetime import timedelta

class TelegramCode(models.Model):
    phone = models.CharField(max_length=32, db_index=True)
    code = models.CharField(max_length=6)
    tg_user_id = models.BigIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    @property
    def is_expired(self):
        return self.created_at < timezone.now() - timedelta(minutes=10)
