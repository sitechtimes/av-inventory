import { defineStore } from "pinia";

export const useStudentStore = defineStore("students", () => {
  const students = ref<Student[]>([]);

  async function fetchStudents() {
    const { data, error } =
      await tryRequestEndpoint<Student[]>("student/students/");
    if (error) return console.error("Error fetching students:", error);
    students.value = data;
  }

  return {
    students,
    fetchStudents,
  };
});
