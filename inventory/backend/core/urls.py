from django.contrib import admin
from django.urls import path, include
from core.views import LoginView, SessionView, LogoutView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", LoginView.as_view(), name="auth_login"),
    path("api/auth/session/", SessionView.as_view(), name="auth_session"),
    path("api/auth/logout/", LogoutView.as_view(), name="auth_logout"),
    path("student/", include("student.urls")),
    path("equipment/", include("equipment.urls")),
]
