from rest_framework import viewsets
from .models import Equipment   
from .serializers import EquipmentSerializer
from rest_framework.permissions import IsAuthenticated
# Create your views here.
class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]  
    @action