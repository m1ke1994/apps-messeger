from typing import Any

from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    displayName = serializers.SerializerMethodField()
    avatarUrl = serializers.SerializerMethodField()
    telegramUsername = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "displayName",
            "username",
            "about",
            "avatarUrl",
            "telegramUsername",
            "phone",
            "email",
        ]
        extra_kwargs = {
            "username": {"required": False, "allow_blank": True},
            "about": {"required": False, "allow_blank": True},
            "email": {"required": False, "allow_blank": True, "allow_null": True},
        }

    def get_displayName(self, obj: User) -> str:
        if obj.display_name:
            return obj.display_name
        if obj.first_name or obj.last_name:
            return f"{obj.first_name} {obj.last_name}".strip()
        return obj.username or (obj.phone or f"user:{obj.pk}")

    def get_avatarUrl(self, obj: User) -> str | None:
        url = obj.avatar_url
        if not url:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(url)
        return url

    def get_telegramUsername(self, obj: User) -> str | None:
        return obj.username or None

    def update(self, instance: User, validated_data: dict[str, Any]) -> User:
        display_name = self.initial_data.get("displayName")
        if display_name is not None:
            instance.display_name = display_name.strip() or None

        for field in ["username", "about", "email"]:
            if field in validated_data:
                setattr(instance, field, validated_data.get(field) or None)

        instance.save()
        return instance
