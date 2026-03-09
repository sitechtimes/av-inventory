from rest_framework import serializers
from .models import ScanInstance

class ScanInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanInstance
        fields = ['student', 'equipment', 'scan_time', 'is_checked_out']