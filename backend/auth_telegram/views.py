import random
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import TelegramCode

User = get_user_model()

def send_code_via_telegram(tg_user_id: int, code: str) -> None:
    """
    Бот НЕ может написать первым — пользователь должен нажать Start вашему боту.
    После первого контакта у вас есть tg_user_id, и можно слать код.
    """
    # пример для python-telegram-bot (реализацию добавим, когда подключим webhook):
    # from telegram import Bot
    # bot = Bot(token=settings.TELEGRAM_BOT_TOKEN)
    # bot.send_message(chat_id=tg_user_id, text=f"Ваш код входа: {code}")
    pass

@api_view(["POST"])
@permission_classes([AllowAny])
def start(request):
    phone = (request.data.get("phone") or "").strip()
    tg_user_id = request.data.get("tg_user_id")
    if not phone:
        return Response({"detail": "phone is required"}, status=status.HTTP_400_BAD_REQUEST)

    code = f"{random.randint(0, 999999):06d}"
    rec = TelegramCode.objects.create(phone=phone, code=code, tg_user_id=tg_user_id)

    if tg_user_id:
        send_code_via_telegram(int(tg_user_id), code)

    return Response({"ok": True, "test_code": code, "needs_bot_chat": tg_user_id is None})

@api_view(["POST"])
@permission_classes([AllowAny])
def verify(request):
    phone = (request.data.get("phone") or "").strip()
    code = (request.data.get("code") or "").strip()
    if not phone or not code:
        return Response({"detail": "phone and code are required"}, status=status.HTTP_400_BAD_REQUEST)

    rec = TelegramCode.objects.filter(phone=phone, code=code, is_used=False).order_by("-created_at").first()
    if not rec or rec.is_expired:
        return Response({"detail": "invalid or expired code"}, status=status.HTTP_400_BAD_REQUEST)

    rec.is_used = True
    rec.save(update_fields=["is_used"])

    user, _ = User.objects.get_or_create(phone=phone, defaults={"username": f"user_{phone}"})

    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {"id": user.id, "phone": user.phone, "username": user.username},
    })
