from rest_framework import serializers
from .models import Equipment


class EquipmentSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Equipment
        fields = ['name', 'barcode', 'equipment_type', 'owner', 'current_condition', 'status']

    def validate_barcode(self, value):
        if self.instance and self.instance.barcode != value:
            raise serializers.ValidationError("Barcode cannot be changed.")
        return value

    def get_status(self, obj):
        return obj.status
    