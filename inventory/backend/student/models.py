from django.db import models
from django.core.validators import MinLengthValidator


class Student(models.Model):
    osis = models.CharField(max_length=9, unique=True, validators=[MinLengthValidator(9)], primary_key=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)  # could use this to email students who havent returned stuff

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.osis})"
