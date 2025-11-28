from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ProfileSerializer


class ProfileMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user, context={"request": request})
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ProfileAvatarUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    max_upload_size = 5 * 1024 * 1024  # 5 MB

    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"detail": "file is required"}, status=status.HTTP_400_BAD_REQUEST)

        if not str(file.content_type).startswith("image/"):
            return Response({"detail": "only image uploads are allowed"}, status=status.HTTP_400_BAD_REQUEST)

        if file.size > self.max_upload_size:
            return Response(
                {"detail": f"file too large (>{self.max_upload_size // (1024 * 1024)} MB)"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        user.avatar = file
        user.save(update_fields=["avatar"])

        serializer = ProfileSerializer(user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
