from django.contrib import admin
from django.contrib.admin import register, ModelAdmin
from .models import Student


@register(Student)
class CustomStudentAdmin(ModelAdmin):
    list_display = (
        "osis",
        "first_name",
        "last_name",
        "email",
    )

    search_fields = ("osis", "first_name", "last_name", "email")
    ordering = ("first_name", "last_name")
