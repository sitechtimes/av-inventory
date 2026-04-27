from rest_framework import serializers

from .models import ScanInstance


class ScanInstanceSerializer(serializers.ModelSerializer):
    is_returned = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ScanInstance
        fields = "__all__"

    def get_is_returned(self, obj):
        return obj.return_time is not None
