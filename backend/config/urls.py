from django.contrib import admin
from django.urls import include, path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .swagger import swagger_urlpatterns

@api_view(["GET"])
@permission_classes([AllowAny])
def health(_):
    return Response({"status": "ok"})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),
    path("api/auth/telegram/", include("auth_telegram.urls")),
    path("api/auth/jwt/", include("users.jwt_urls")),
] + swagger_urlpatterns
