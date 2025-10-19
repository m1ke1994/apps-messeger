from django.urls import path
from .views import start, verify

urlpatterns = [
    path("start/", start, name="telegram_start"),
    path("verify/", verify, name="telegram_verify"),
]
