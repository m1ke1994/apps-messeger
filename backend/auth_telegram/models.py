from datetime import timedelta

from django.db import models
from django.utils import timezone


class PhoneVerificationCode(models.Model):
    phone = models.CharField(max_length=32, db_index=True)
    code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_expired(self) -> bool:
        return timezone.now() >= self.expires_at

    @classmethod
    def create_with_ttl(cls, phone: str, code: str, minutes: int = 10) -> "PhoneVerificationCode":
        return cls.objects.create(
            phone=phone,
            code=code,
            expires_at=timezone.now() + timedelta(minutes=minutes),
        )


# Legacy table kept for backward compatibility; not used in the new flow.
class TelegramCode(models.Model):
    phone = models.CharField(max_length=32, db_index=True)
    code = models.CharField(max_length=6)
    tg_user_id = models.BigIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    @property
    def is_expired(self):
        return self.created_at < timezone.now() - timedelta(minutes=10)
