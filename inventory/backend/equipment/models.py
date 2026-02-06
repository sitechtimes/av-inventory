from django.db import models
from student.models import Student
# Create your models here.
class Equipment(models.Model):
    EQUIPMENT_CHOICES = () # van buren
    name = models.CharField(max_length=20,primary_key=True)#change to shorgter based on how logn code is 
    equipment_type = models.CharField(max_length=20)#should be shorter
    owner = models.ForeignKey(Student, on_delete=models.SET_NULL)

    

    def __str__(self):
        status = "Available" if self.owner =="000000000" else "Checked out" # planning on having van buren be the dummy 000000000 osis number because its not safe to have him be the null option for ovsious reasons.