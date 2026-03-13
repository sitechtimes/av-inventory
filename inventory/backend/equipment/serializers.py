from rest_framework import serializers
from .models import Equipment


class EquipmentSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Equipment
        fields = ['name', 'equipment_type', 'owner', 'current_condition', 'status']

    def get_status(self, obj):
        return obj.status
