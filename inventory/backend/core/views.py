from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = str(request.data.get("username", "")).strip()
        password = request.data.get("password", "")

        user = authenticate(request=request, username=username, password=password)
        if user is None:
            return Response(
                {"detail": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        access_token = str(AccessToken.for_user(user))
        response = Response({"username": user.username}, status=status.HTTP_200_OK)
        response.set_cookie(
            key="av_access_token",
            value=access_token,
            max_age=60 * 60,
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Lax",
            path="/",
        )

        return response


class SessionView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        raw_token = request.COOKIES.get("av_access_token")
        if not raw_token:
            return Response({"authenticated": False}, status=status.HTTP_200_OK)

        try:
            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(raw_token)
            user = jwt_auth.get_user(validated_token)
        except (InvalidToken, TokenError):
            return Response({"authenticated": False}, status=status.HTTP_200_OK)

        return Response(
            {
                "authenticated": True,
                "username": user.username,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response({"detail": "Logged out."}, status=status.HTTP_200_OK)
        response.delete_cookie("av_access_token", path="/")
        return response
