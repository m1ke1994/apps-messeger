from django.contrib import admin

from .models import PhoneVerificationCode, TelegramCode


@admin.register(PhoneVerificationCode)
class PhoneVerificationCodeAdmin(admin.ModelAdmin):
    list_display = ("phone", "code", "is_used", "expires_at", "created_at")
    list_filter = ("is_used",)
    search_fields = ("phone", "code")


@admin.register(TelegramCode)
class TelegramCodeAdmin(admin.ModelAdmin):
    list_display = ("phone", "code", "is_used", "created_at")
    search_fields = ("phone", "code")
