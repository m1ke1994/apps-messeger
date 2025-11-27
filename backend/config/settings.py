from pathlib import Path
import environ
from datetime import timedelta

# === БАЗОВЫЕ НАСТРОЙКИ ===
BASE_DIR = Path(__file__).resolve().parent.parent

# Подключаем .env
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(BASE_DIR / ".env")

DEBUG = env("DEBUG")
SECRET_KEY = env("SECRET_KEY")
JWT_SECRET = env("JWT_SECRET", default=SECRET_KEY)
ALLOWED_HOSTS = [h.strip() for h in env("ALLOWED_HOSTS", default="").split(",") if h.strip()]

# === ПРИЛОЖЕНИЯ ===
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # внешние
    "rest_framework",
    "drf_yasg",
    "corsheaders",

    # локальные
    "users",
    "auth_telegram",
]

# === MIDDLEWARE ===
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# === БАЗА ДАННЫХ ===
DATABASES = {
    "default": env.db(
        "DATABASE_URL",
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
    )
}

# === ВРЕМЯ И ЛОКАЛИ ===
LANGUAGE_CODE = "ru-ru"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# === СТАТИКА ===
STATIC_URL = "static/"

# === CORS ===
CORS_ALLOWED_ORIGINS = [s for s in env("CORS_ALLOWED_ORIGINS", default="").split(",") if s]

# === REST FRAMEWORK + JWT ===
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=6),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),
    "SIGNING_KEY": JWT_SECRET,
}

# === КАСТОМНЫЙ ПОЛЬЗОВАТЕЛЬ ===
AUTH_USER_MODEL = "users.User"

# === ПРОЧЕЕ ===
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# === TELEGRAM ===
TELEGRAM_BOT_TOKEN = env("TELEGRAM_BOT_TOKEN")

# Logging for Telegram bot visibility
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {"format": "[%(levelname)s] %(asctime)s %(name)s: %(message)s"},
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
        },
    },
    "loggers": {
        "auth_telegram": {"handlers": ["console"], "level": "INFO"},
        "telegram": {"handlers": ["console"], "level": "INFO"},
        "telegram.bot": {"handlers": ["console"], "level": "INFO"},
    },
}
