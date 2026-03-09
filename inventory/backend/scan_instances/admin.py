from django.contrib import admin
from .models import ScanInstance
from django.contrib.admin import register, ModelAdmin


# Register your models here.
@register(ScanInstance)
class CustomScanAdmin(ModelAdmin):
    list_display = (
        "student",
        "equipment",
        "scan_time",
        "is_checked_out",
    )

    search_fields = ("student__first_name", "student__last_name", "equipment__name")
    list_filter = ("is_checked_out")
    ordering = ("scan_time")
