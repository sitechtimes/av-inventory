from django.db import models
from student.models import Student


# Create your models here.
class EquipmentType(models.Model):
    code = models.CharField(max_length=10)
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Equipment(models.Model):
    # EQUIPMENT_CHOICES = [
    #     ("BAG", "CAMERA BAG"),
    #     ("NXBAT", "CAMERA BATTERY"),
    #     ("BOOM", "BOOM POLE"),
    #     ("PHBKT", "PHONE BRACKET"),
    #     ("TBBKT", "TABLET BRACKET"),
    #     ("BCHG", "CAM BATTERY CHARGER"),
    #     ("NX100", "CAMERA"),
    #     ("HND", "HANDHELD MIC"),
    #     ("HDPH", "HEADPHONES"),
    #     ("IPAD", "IPAD"),
    #     ("LAPCHRG", "LAPTOP CHARGER"),
    #     ("LAV", "LAV MIC"),
    #     ("LED", "LED LIGHT"),
    #     ("TSC-SD", "TASCAM SD CARD"),
    #     ("SD", "SD CARD"),
    #     ("SHGN", "SHOTGUN MIC"),
    #     ("TSCM", "TASCAM"),
    #     ("TPD", "TRIPOD INTRO"),
    #     ("MANF", "TRIPOD ADV"),
    #     ("MONPD", "MONOPOD"),
    #     ("XLR", "XLR CABLE"),
    # ]
    CONDITION_CHOICES = [
        ("GOOD", "GOOD"),
        ("DAMAGED", "DAMAGED"),
        ("LOST", "LOST"),
    ]
    name = models.CharField(max_length=15, primary_key=True)
    equipment_type = models.ForeignKey(EquipmentType, on_delete=models.CASCADE)
    owner = models.ForeignKey(
        Student, on_delete=models.SET_DEFAULT, default="000000000"  # van buren is the dummy 000000000 osis so things dont have to be nullable
    )
    current_condition = models.CharField(
        max_length=7, blank=True, choices=CONDITION_CHOICES
    )

    @property
    def status(self):
        return "Available" if self.owner.osis == "000000000" else "Checked out"
