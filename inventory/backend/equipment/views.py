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
