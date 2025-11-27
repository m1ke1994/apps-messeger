from django.urls import path

from .views import verify_code

urlpatterns = [
    path("verify-code/", verify_code, name="telegram_verify_code"),
]
