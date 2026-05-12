import { defineStore } from "pinia";

export const useStudentStore = defineStore("students", () => {
  const students = ref<Student[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchStudents = async () => {
    loading.value = true;
    error.value = null;

    try {
      const result = await tryRequestEndpoint<Student[]>(
        "student/students/",
        "GET",
      );

      if (!("error" in result) && result.data) {
        students.value = result.data;
      } else {
        throw new Error("Failed to fetch students");
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : "An error occurred";
      console.error("Store: Error fetching students:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    students,
    loading,
    error,
    fetchStudents,
  };
});
