from django.contrib import admin
from .models import Student
from django.contrib.admin import register, ModelAdmin

# Register your models here.
@register(Student)
class CustomStudentAdmin(ModelAdmin):
    list_display = (
        "osis",
        "first_name",
        "last_name",
        "email",
    )

    search_fields = ("osis", "first_name", "last_name", "email")
    ordering = ("first_name","last_name")
    
