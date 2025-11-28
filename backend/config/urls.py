from django.contrib import admin
from django.urls import include, path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings
from django.conf.urls.static import static

from users.profile_views import ProfileAvatarUploadView, ProfileMeView

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
    path("api/profile/", include("users.profile_urls")),
    # direct bindings to avoid accidental urlconf omissions
    path("api/profile/me", ProfileMeView.as_view(), name="profile-me-direct"),
    path("api/profile/me/", ProfileMeView.as_view(), name="profile-me-direct-slash"),
    path("api/profile/avatar", ProfileAvatarUploadView.as_view(), name="profile-avatar-direct"),
    path("api/profile/avatar/", ProfileAvatarUploadView.as_view(), name="profile-avatar-direct-slash"),
] + swagger_urlpatterns

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
