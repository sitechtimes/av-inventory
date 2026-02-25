from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from inventory.backend.student.models import Student
from .models import Equipment


class EquipmentTests(APITestCase):
    def test_equipment_creation(self):
        student_url = reverse("student-list")
        equipment_url = reverse("equipment-list")
        student_data={
            "osis": "123456789",
            "first_name": "Samuel",
            "last_name": "Kipnis",
            "email": "samuelkipnis@example.com",
        }
        equipment_data = {
            "name": "BAG-01",
            "equipment_type":"CAMERA BAG",
            "owner":1
        }
        student_response = self.client.post(student_url, data=student_data, format="json")
        equipment_response = self.client.post(equipment_url, data=equipment_data, format="json")
        print("\n=== EQUIPMENT CREATION ===")
        print("CREATION RESPONSE STATUS:", equipment_response.status_code)
        print("CREATION RESPONSE DATA:", equipment_response.data)
        print("EQUIPMENT COUNT AFTER CREATION:", Equipment.objects.count())
        print("EQUIPMENT IN DB:", Equipment.objects.first().__dict__)
        print("========================\n")

        self.assertEqual(equipment_response.status_code, 201)
        self.assertEqual(Equipment.objects.count(), 1)
        self.assertEqual(Equipment.objects.first().name, "BAG-01")

    def test_equipment_list(self):
        Student.objects.create(
            osis="121212121",
            first_name="Samuel",
            last_name="Samnis",
            email="kipmuelsamnis@example.com",
        )
        Student.objects.create(
            osis="676767676",
            first_name="Kipmuel",
            last_name="Samnis",
            email="kipmuelsamns@example.com",
        )
        Equipment.objects.create(
            name="BAG-01",
            equipment_type="CAMERA BAG",
            owner=1
        )
        
        Equipment.objects.create(
            name="BAG-02",
            equipment_type="CAMERA BAG",
            owner=2
        )

        url = reverse("equipment-list")
        response = self.client.get(url, format="json")
        print("\n=== STUDENT LIST ===")
        print("LIST RESPONSE STATUS:", response.status_code)
        print("LIST RESPONSE DATA:", response.data)
        print("ALL EQUIPMENT IN DB:")
        for s in Equipment.objects.all():
            print(s.__dict__)
        print("===================\n")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["name"], "BAG-01")
        self.assertEqual(response.data[1]["name"], "BAG-02")

    def test_equipment_update(self):
        student = Student.objects.create(
            osis="123456789",
            first_name="Richard",
            last_name="Kipnis",
            email="richardkipnis@example.com",
        )
        equipment = Equipment.objects.create(
            name="BAG-01",
            equipment_type="CAMERA BAG",
            owner=student
        )

        url = reverse("equipment-detail", kwargs={"pk": equipment.pk})
        data = {"name": "BAG-02"}

        response = self.client.patch(url, data, format="json")

        equipment.refresh_from_db()
        print("\n=== EQUIPMENT UPDATE ===")
        print("UPDATE RESPONSE STATUS:", response.status_code)
        print("UPDATE RESPONSE DATA:", response.data)
        print("=====================\n")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(student.first_name, "Samuel")
