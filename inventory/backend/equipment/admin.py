from django.contrib import admin
from .models import Equipment
from django.contrib.admin import register, ModelAdmin


# Register your models here.
@register(Equipment)
class CustomEquipmentAdmin(ModelAdmin):
    list_display = (
        "name",
        "equipment_type",
        "owner",
    )

    search_fields = ("name", "equipment_type", "owner__first_name", "owner__last_name")
    ordering = ("name", "equipment_type")
