import logging
import random
from typing import Optional

from django.contrib.auth import get_user_model
from django.db import transaction
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import PhoneVerificationCode

logger = logging.getLogger(__name__)
User = get_user_model()


def normalize_phone(raw: str) -> Optional[str]:
    digits = "".join(ch for ch in raw if ch.isdigit() or ch == "+")
    if digits.startswith("8") and len(digits) == 11:
        digits = "+7" + digits[1:]
    if digits.startswith("7") and len(digits) >= 11:
        digits = "+" + digits
    if not digits.startswith("+") and digits.isdigit():
        digits = "+" + digits
    if len(digits) < 8 or len(digits) > 16 or not digits.startswith("+"):
        return None
    return digits


def generate_code() -> str:
    return f"{random.randint(0, 999999):06d}"


def upsert_user(phone: str, telegram_chat_id: Optional[int] = None) -> User:
    username = f"user_{phone.strip('+')}"
    user, created = User.objects.get_or_create(
        phone=phone,
        defaults={"username": username},
    )
    if telegram_chat_id and user.telegram_chat_id != telegram_chat_id:
        user.telegram_chat_id = telegram_chat_id
        user.save(update_fields=["telegram_chat_id"])
    if created:
        logger.info("Created user for phone %s (chat_id=%s)", phone, telegram_chat_id)
    return user


verify_request_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["phone", "code"],
    properties={
        "phone": openapi.Schema(type=openapi.TYPE_STRING, example="+79990000000"),
        "code": openapi.Schema(type=openapi.TYPE_STRING, example="123456"),
    },
)

verify_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "token": openapi.Schema(type=openapi.TYPE_STRING, description="JWT access token"),
        "refresh": openapi.Schema(type=openapi.TYPE_STRING, description="JWT refresh token"),
        "user": openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                "phone": openapi.Schema(type=openapi.TYPE_STRING),
                "username": openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    },
)


@swagger_auto_schema(
    method="post",
    request_body=verify_request_schema,
    responses={200: openapi.Response("OK", verify_response_schema), 400: "invalid code"},
    operation_summary="Проверка кода из Telegram",
    operation_description="Проверяет одноразовый код, выданный ботом после отправки контакта.",
)
@api_view(["POST"])
@permission_classes([AllowAny])
def verify_code(request):
    phone_raw = (request.data.get("phone") or "").strip()
    code = (request.data.get("code") or "").strip()

    phone = normalize_phone(phone_raw)
    if not phone or not code:
        return Response({"detail": "phone and code are required"}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        rec = (
            PhoneVerificationCode.objects.select_for_update()
            .filter(phone=phone, code=code, is_used=False)
            .order_by("-created_at")
            .first()
        )
        if not rec:
            logger.warning("Verify failed: code not found phone=%s code=%s", phone, code)
            return Response({"detail": "invalid code"}, status=status.HTTP_400_BAD_REQUEST)
        if rec.is_expired:
            logger.warning("Verify failed: code expired phone=%s code=%s", phone, code)
            return Response({"detail": "code expired"}, status=status.HTTP_400_BAD_REQUEST)

        rec.is_used = True
        rec.save(update_fields=["is_used"])

    user = upsert_user(phone)
    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "token": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {"id": user.id, "phone": user.phone, "username": user.username},
        }
    )
