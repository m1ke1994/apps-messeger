import os
import sys

from django.apps import AppConfig


class AuthTelegramConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'auth_telegram'

    def ready(self):
        # Avoid double-start in Django autoreload
        if any(cmd in sys.argv for cmd in ("makemigrations", "migrate", "collectstatic", "test", "shell")):
            return
        if os.environ.get("RUN_MAIN") not in (None, "true", "True"):
            return
        try:
            from .bot import start_bot_in_thread

            start_bot_in_thread()
        except Exception:  # pragma: no cover - defensive boot guard
            import logging
            logging.getLogger(__name__).exception("Failed to start Telegram bot on app ready")
