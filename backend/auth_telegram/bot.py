import asyncio
import logging
import os
import threading
from typing import Optional

from django.conf import settings
from asgiref.sync import sync_to_async
from telegram import KeyboardButton, ReplyKeyboardMarkup, ReplyKeyboardRemove, Update
from telegram.ext import (
    Application,
    ApplicationBuilder,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    filters,
)

from .models import PhoneVerificationCode
from .views import generate_code, normalize_phone, upsert_user

logger = logging.getLogger(__name__)
_bot_started = False


def _build_application() -> Optional[Application]:
    token = getattr(settings, "TELEGRAM_BOT_TOKEN", None)
    if not token:
        logger.warning("TELEGRAM_BOT_TOKEN is not configured; Telegram bot will not start.")
        return None

    app = ApplicationBuilder().token(token).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.CONTACT, handle_contact))
    # Фолбэк: принимаем телефон текстом, если пользователь не может отправить контакт.
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text_phone))
    return app


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    button = KeyboardButton(text="Отправить контакт", request_contact=True)
    markup = ReplyKeyboardMarkup([[button]], resize_keyboard=True, one_time_keyboard=True)
    await update.effective_message.reply_text(
        "Для входа отправьте контакт или номер в формате +79XXXXXXXX.",
        reply_markup=markup,
    )


async def handle_contact(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    message = update.effective_message
    contact = message.contact
    phone = normalize_phone(contact.phone_number if contact else "")
    chat_id = update.effective_chat.id if update.effective_chat else None

    if not phone:
        await message.reply_text("Не удалось распознать номер. Введите его в формате +79990000000.")
        return
    await _send_code(phone, chat_id, message)


async def handle_text_phone(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    message = update.effective_message
    phone_raw = message.text or ""
    phone = normalize_phone(phone_raw)
    chat_id = update.effective_chat.id if update.effective_chat else None
    if not phone:
        return
    await _send_code(phone, chat_id, message)


async def _send_code(phone: str, chat_id: Optional[int], message):
    user = await sync_to_async(upsert_user)(phone, telegram_chat_id=chat_id)
    code = generate_code()
    await sync_to_async(PhoneVerificationCode.create_with_ttl)(phone=phone, code=code, minutes=10)

    await message.reply_text(
        f"{phone}\nВаш код для входа: {code}\nВведите свой номер телефона и этот код на сайте.",
        reply_markup=ReplyKeyboardRemove(),
    )
    logger.info("Sent login code %s to %s for chat %s (user %s)", code, phone, chat_id, user.id)


def start_bot_in_thread() -> None:
    global _bot_started
    if _bot_started or os.environ.get("DISABLE_TELEGRAM_BOT"):
        return

    application = _build_application()
    if application is None:
        return

    def _run() -> None:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(
                application.run_polling(
                    allowed_updates=Update.ALL_TYPES,
                    stop_signals=None,  # сигналами управляет основной процесс
                    close_loop=False,
                )
            )
        except Exception:
            logger.exception("Telegram bot stopped unexpectedly")
        finally:
            try:
                loop.stop()
                loop.close()
            except Exception:
                pass

    thread = threading.Thread(target=_run, name="telegram-bot", daemon=True)
    thread.start()
    _bot_started = True
    logger.warning("Telegram bot thread started (polling).")
