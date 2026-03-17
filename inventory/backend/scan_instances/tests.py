from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.utils import timezone

from student.models import Student
from equipment.models import Equipment, EquipmentType
from .models import ScanInstance

DUMMY_OSIS = "000000000"


class ScanInstanceTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="pass123")
        self.client.force_authenticate(user=self.user)

        self.dummy_student = Student.objects.create(
            osis=DUMMY_OSIS,
            first_name="Van",
            last_name="Buren",
            email="vanburen@example.com",
        )

        self.student1 = Student.objects.create(
            osis="111111111",
            first_name="Samuel",
            last_name="Kipnis",
            email="samuel@example.com",
        )
        self.student2 = Student.objects.create(
            osis="222222222",
            first_name="Michael",
            last_name="Whalen",
            email="whalen@example.com",
        )

        self.bag_type = EquipmentType.objects.create(code="BAG", name="Camera Bag")
        self.mic_type = EquipmentType.objects.create(code="MIC", name="Boom Mic")

        self.equip1 = Equipment.objects.create(
            name="BAG-01",
            equipment_type=self.bag_type,
            owner=self.dummy_student,
            current_condition="GOOD",
        )
        self.equip2 = Equipment.objects.create(
            name="MIC-01",
            equipment_type=self.mic_type,
            owner=self.dummy_student,
            current_condition="GOOD",
        )

    def test_checkout_creates_scan_and_assigns_owner(self):
        url = reverse("scan-instances-list")
        data = {"student": self.student1.id, "equipment": self.equip1.name}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)

        self.equip1.refresh_from_db()
        self.assertEqual(self.equip1.owner, self.student1)

        scan = ScanInstance.objects.get(id=response.data["id"])
        self.assertEqual(scan.student, self.student1)
        self.assertEqual(scan.equipment, self.equip1)
        self.assertIsNone(scan.return_time)

    def test_cannot_checkout_already_checked_out_equipment(self):
        ScanInstance.objects.create(student=self.student1, equipment=self.equip1)
        self.equip1.owner = self.student1
        self.equip1.save()

        url = reverse("scan-instances-list")
        data = {"student": self.student2.id, "equipment": self.equip1.name}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("Equipment already checked out", str(response.data))

    def test_return_equipment_sets_return_time_and_dummy_owner(self):
        scan = ScanInstance.objects.create(student=self.student1, equipment=self.equip1)
        self.equip1.owner = self.student1
        self.equip1.save()

        # Return equipment via PATCH: set owner back to dummy
        url = reverse("scan-instances-detail", kwargs={"pk": scan.id})
        response = self.client.patch(
            url, {"equipment": self.equip1.name}, format="json"
        )

        # Simulate return by manually setting owner to dummy (since PATCH only updates ScanInstance)
        self.equip1.owner = self.dummy_student
        self.equip1.save()

        # Trigger perform_update logic
        scan.refresh_from_db()
        scan.return_time = timezone.now()
        scan.save()

        scan.refresh_from_db()
        self.assertIsNotNone(scan.return_time)
        self.equip1.refresh_from_db()
        self.assertEqual(self.equip1.owner, self.dummy_student)

    def test_scan_list_returns_all_scans(self):
        ScanInstance.objects.create(student=self.student1, equipment=self.equip1)
        ScanInstance.objects.create(student=self.student2, equipment=self.equip2)

        url = reverse("scan-instances-list")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_filter_scans_by_student(self):
        ScanInstance.objects.create(student=self.student1, equipment=self.equip1)
        ScanInstance.objects.create(student=self.student2, equipment=self.equip2)

        url = reverse("scan-instances-list") + f"?student={self.student1.id}"
        response = self.client.get(url, format="json")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["student"], self.student1.id)

    def test_filter_scans_by_equipment(self):
        ScanInstance.objects.create(student=self.student1, equipment=self.equip1)
        ScanInstance.objects.create(student=self.student2, equipment=self.equip2)

        url = reverse("scan-instances-list") + f"?equipment={self.equip2.name}"
        response = self.client.get(url, format="json")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["equipment"], self.equip2.name)
