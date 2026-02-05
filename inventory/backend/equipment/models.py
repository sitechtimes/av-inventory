from django.db import models
from student.models import Student
# Create your models here.
class Equipment(models.Model):
    name = models.CharField(max_length=100)
    scan_id = models.CharField(max_length=50, unique=True)
    current_borrower = models.ForeignKey(Student, on_delete=models.SET_NULL)
    date_checked_out = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        status = "Checked out" if self.current_borrower == "000000000" else "Available"
        return f"{self.name} ({self.scan_id}) - {status}"