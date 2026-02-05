from django.contrib import admin
from .models import Equipment
from django.contrib.admin import register, ModelAdmin
# Register your models here.
@register(Equipment)
class CustomEquipmentAdmin(ModelAdmin):
    list_display = (
        "name",
        "scan_id",
        "current_borrower",
        "date_checked_out",
        "due_date",
    )

    search_fields = ("name", "scan_id", "current_borrower__first_name", "current_borrower__last_name")
    ordering = ("name")