from rest_framework import serializers
from .models import ScanInstance

class ScanInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanInstance
        fields = [
            "id",
            "student",
            "equipment",
            "checkout_time",
            "return_time",
            "is_returned",
        ]
