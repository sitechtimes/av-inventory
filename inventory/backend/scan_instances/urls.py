from django.urls import path, include
from rest_framework import routers
from .views import ScanInstanceViewSet

router = routers.DefaultRouter()
router.register(r"scan-instances", ScanInstanceViewSet)
urlpatterns = [
    path("", include(router.urls)),
]
