from django.db import models
from student.models import Student
from equipment.models import Equipment

# Create your models here.
class ScanInstance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    scan_time = models.DateTimeField(auto_now_add=True)
    is_checked_out = models.BooleanField(default=False)

