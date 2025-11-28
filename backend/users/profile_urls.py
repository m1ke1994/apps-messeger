from django.urls import path

from .profile_views import ProfileAvatarUploadView, ProfileMeView

urlpatterns = [
    path("me", ProfileMeView.as_view(), name="profile-me"),
    path("me/", ProfileMeView.as_view(), name="profile-me-slash"),
    path("avatar", ProfileAvatarUploadView.as_view(), name="profile-avatar"),
    path("avatar/", ProfileAvatarUploadView.as_view(), name="profile-avatar-slash"),
]
