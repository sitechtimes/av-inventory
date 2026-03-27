from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Equipment
from .serializers import EquipmentSerializer


class EquipmentViewSet(viewsets.ModelViewSet):
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Equipment.objects.all()

    def get_queryset(self):
        queryset = super().get_queryset()

        student_osis = self.request.query_params.get("student_osis")
        equipment_type = self.request.query_params.get("equipment_type")

        if student_osis:
            queryset = queryset.filter(owner__osis=student_osis)

        if equipment_type:
            queryset = queryset.filter(equipment_type=equipment_type)

        return queryset
