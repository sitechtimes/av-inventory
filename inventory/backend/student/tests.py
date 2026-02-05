from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Student


class StudentTests(APITestCase):
    def test_student_creation(self):
        url = reverse("student-list")
        data = {
            "osis": "777888999",
            "first_name": "Samuel",
            "last_name": "Kipnis",
            "email": "samuelkipnis@example.com",
        }

        response = self.client.post(url, data, format="json")
        print("\n=== STUDENT CREATION ===")
        print("CREATION RESPONSE STATUS:", response.status_code)
        print("CREATION RESPONSE DATA:", response.data)
        print("STUDENT COUNT AFTER CREATION:", Student.objects.count())
        print("STUDENT IN DB:", Student.objects.first().__dict__)
        print("========================\n")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Student.objects.count(), 1)
        self.assertEqual(Student.objects.first().first_name, "Samuel")

    def test_student_list(self):
        Student.objects.create(
            osis="111222333",
            first_name="Kipnis",
            last_name="Samuel",
            email="kipnissamuel@example.com",
        )
        Student.objects.create(
            osis="444555666",
            first_name="Kipmuel",
            last_name="Samnis",
            email="kipmuelsamnis@example.com",
        )

        url = reverse("student-list")
        response = self.client.get(url, format="json")
        print("\n=== STUDENT LIST ===")
        print("LIST RESPONSE STATUS:", response.status_code)
        print("LIST RESPONSE DATA:", response.data)
        print("ALL STUDENTS IN DB:")
        for s in Student.objects.all():
            print(s.__dict__)
        print("===================\n")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["first_name"], "Kipnis")
        self.assertEqual(response.data[1]["first_name"], "Kipmuel")

    def test_student_update(self):
        student = Student.objects.create(
            osis="123456789",
            first_name="Richard",
            last_name="Kipnis",
            email="richardkipnis@example.com",
        )

        url = reverse("student-detail", kwargs={"pk": student.pk})
        data = {"first_name": "Samuel"}

        response = self.client.patch(url, data, format="json")

        student.refresh_from_db()
        print("\n=== STUDENT UPDATE ===")
        print("UPDATE RESPONSE STATUS:", response.status_code)
        print("UPDATE RESPONSE DATA:", response.data)
        print("=====================\n")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(student.first_name, "Samuel")
