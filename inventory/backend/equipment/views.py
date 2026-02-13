from rest_framework import viewsets
from .models import Equipment   
from .serializers import EquipmentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
# Create your views here.
class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]  
    @action(detail=True, methods=['patch'])
    def update_equipment_owner(self, request, pk=None):
        equipment = self.get_object()
        new_owner = request.data.get("owner")
        equipment.owner = new_owner
        equipment.save()
        return Response({"status": "owner updated"})
    @action(detail=True, methods=['get'])
    def filter_by_student(self, request, pk=None):
        student_osis = request.query_params.get("student_osis")
        if student_osis:
            equipment = self.queryset.filter(owner__osis=student_osis)
        else:
            equipment = self.queryset.none()
        serializer = self.get_serializer(equipment, many=True)
        return Response(serializer.data)
    @action(detail=True, methods=['get'])
    def filter_by_equipment_type(self, request, pk=None):
        equipment_type = request.query_params.get("equipment_type")
        if equipment_type:
            equipment = self.queryset.filter(equipment_type=equipment_type)
        else:
            equipment = self.queryset.none()
        serializer = self.get_serializer(equipment, many=True)
        return Response(serializer.data)

