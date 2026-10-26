from django.urls import path, include
from rest_framework import routers
from .views import EquipmentViewSet

router = routers.DefaultRouter()
router.register(r"equipment", EquipmentViewSet, basename="equipment")
urlpatterns = [
    path("", include(router.urls)),
]
