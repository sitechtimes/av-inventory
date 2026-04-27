from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from student.models import Student

from .models import Equipment


class EquipmentTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="pass123")
        self.client.force_authenticate(user=self.user)

        self.student1 = Student.objects.create(
            osis="111111111",
            first_name="Alice",
            last_name="Smith",
            email="alice@example.com",
        )
        self.student2 = Student.objects.create(
            osis="222222222",
            first_name="Bob",
            last_name="Jones",
            email="bob@example.com",
        )

        self.dummy_student = Student.objects.create(
            osis="000000000",
            first_name="Van",
            last_name="Buren",
            email="vanburen@example.com",
        )

        Equipment.objects.create(
            name="BAG-01",
            equipment_type="BAG",
            owner=self.student1,
            current_condition="GOOD",
        )
        Equipment.objects.create(
            name="BAT-01",
            equipment_type="NXBAT",
            owner=self.student1,
            current_condition="GOOD",
        )
        Equipment.objects.create(
            name="MIC-01",
            equipment_type="BOOM",
            owner=self.student2,
            current_condition="DAMAGED",
        )
        Equipment.objects.create(
            name="TRIPOD-01",
            equipment_type="MANF",
            owner=self.dummy_student,
            current_condition="GOOD",
        )

    def test_equipment_creation(self):
        print("\n================ Running test_equipment_creation ================\n")
        student = Student.objects.create(
            osis="333333333",
            first_name="Samuel",
            last_name="Kipnis",
            email="samuel@example.com",
        )

        equipment_url = reverse("equipment-list")
        equipment_data = {
            "name": "CAM-01",
            "equipment_type": "NX100",
            "owner": student.osis,
            "current_condition": "GOOD",
        }
        print(f"Posting data: {equipment_data}")
        print(f"POST {equipment_url}")
        response = self.client.post(equipment_url, equipment_data, format="json")
        print(f"Response status: {response.status_code}, data: {response.data}")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Equipment.objects.filter(name="CAM-01").count(), 1)

    def test_equipment_list(self):
        print("\n================ Running test_equipment_list ================\n")
        url = reverse("equipment-list")
        print(f"GET: {url}")
        response = self.client.get(url, format="json")
        print(f"Response status: {response.status_code}, data: {response.data}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 4)

    def test_equipment_update(self):
        print("\n================ Running test_equipment_update ================\n")
        equipment = Equipment.objects.get(name="BAG-01")
        url = reverse("equipment-detail", kwargs={"pk": equipment.name})
        data = {"equipment_type": "NXBAT"}
        print(f"Patching with data: {data}")
        print(f"UPDATE: {url}")

        response = self.client.patch(url, data, format="json")
        print(f"Response status: {response.status_code}, data: {response.data}")
        equipment.refresh_from_db()
        print(f"Updated equipment_type: {equipment.equipment_type}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(equipment.equipment_type, "NXBAT")

    def test_filter_by_student(self):
        print("\n================ Running test_filter_by_student ================\n")
        url = reverse("equipment-list") + "?student_osis=111111111"
        print(f"GET {url}")
        response = self.client.get(url, format="json")
        print(f"Response status: {response.status_code}, data: {response.data}")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        names = [e["name"] for e in response.data]
        print(f"Names: {names}")
        self.assertIn("BAG-01", names)
        self.assertIn("BAT-01", names)

    def test_filter_by_equipment_type(self):
        print(
            "\n================ Running test_filter_by_equipment_type ================\n"
        )
        url = reverse("equipment-list") + "?equipment_type=BOOM"
        print(f"GET {url}")
        response = self.client.get(url, format="json")
        print(f"Response status: {response.status_code}, data: {response.data}")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "MIC-01")

    def test_filter_by_student_and_type(self):
        print(
            "\n================ Running test_filter_by_student_and_type ================\n"
        )
        url = reverse("equipment-list") + "?student_osis=111111111&equipment_type=NXBAT"
        print(f"GET {url}")
        response = self.client.get(url, format="json")
        print(f"Response status: {response.status_code}, data: {response.data}")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "BAT-01")

    def test_filter_no_results(self):
        print("\n================ Running test_filter_no_results ================\n")
        url = reverse("equipment-list") + "?student_osis=999999999"
        print(f"GET {url}")
        response = self.client.get(url, format="json")
        print(f"Response status: {response.status_code}, data: {response.data}")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)
