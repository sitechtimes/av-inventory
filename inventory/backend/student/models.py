from django.db import models
from django.core.validators import MinLengthValidator
# Create your models here.
class Student(models.Model):
    osis = models.CharField(max_length=9, unique=True, validators=[MinLengthValidator(9)],primary_key=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True) # we could do an email field so he can have like a button or smth to email a student whos taken a piece of equipment and hasnt returned it or smth
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.osis})"
