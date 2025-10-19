from django.contrib import admin
from django.urls import path, include
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(["GET"])
@permission_classes([AllowAny])
def health(_):
    return Response({"status": "ok"})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),
    path("api/auth/telegram/", include("auth_telegram.urls")),
    path("api/auth/jwt/", include("users.jwt_urls")),
]
