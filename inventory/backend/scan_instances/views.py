from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.exceptions import ValidationError

from student.models import Student
from equipment.models import Equipment
from .models import ScanInstance
from .serializers import ScanInstanceSerializer


class ScanInstanceViewSet(viewsets.ModelViewSet):
    queryset = ScanInstance.objects.all()
    serializer_class = ScanInstanceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        student = self.request.query_params.get("student")
        equipment = self.request.query_params.get("equipment")

        if student:
            queryset = queryset.filter(student=student)
        if equipment:
            queryset = queryset.filter(equipment__name=equipment)

        return queryset

    def perform_create(self, serializer):
        scan = serializer.save()
        dummy_student = Student.objects.get(osis="000000000")
        equipment = scan.equipment
        student = scan.student

        if equipment.owner != dummy_student and equipment.owner != student:
            raise ValidationError({"detail": "Equipment already checked out"})

        equipment.owner = student
        equipment.save(update_fields=["owner"])

    def perform_update(self, serializer):
        scan = serializer.save()

        if scan.return_time is None:
            scan.return_time = timezone.now()
            scan.save(update_fields=["return_time"])

        dummy_student = Student.objects.get(osis="000000000")
        if scan.equipment.owner != dummy_student:
            scan.equipment.owner = dummy_student
            scan.equipment.save(update_fields=["owner"])
