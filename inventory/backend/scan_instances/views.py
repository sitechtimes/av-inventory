from django.utils import timezone
from rest_framework import viewsets, serializers
from .models import ScanInstance, Equipment
from .serializers import ScanInstanceSerializer

DUMMY_OWNER_OSIS = "000000000"  # van buren


class ScanInstanceViewSet(viewsets.ModelViewSet):
    queryset = ScanInstance.objects.all()
    serializer_class = ScanInstanceSerializer

    def perform_create(self, serializer):
        equipment = serializer.validated_data["equipment"]
        student = serializer.validated_data["student"]

        if equipment.status == "Checked out":
            raise serializers.ValidationError("Equipment already checked out")

        equipment.owner = student
        equipment.save()

        serializer.save()

    def perform_update(self, serializer):
        instance = serializer.instance
        updated = serializer.save()

        equipment = updated.equipment
        if equipment.owner.osis == DUMMY_OWNER_OSIS and updated.return_time is None:
            updated.return_time = timezone.now()
            updated.save()
