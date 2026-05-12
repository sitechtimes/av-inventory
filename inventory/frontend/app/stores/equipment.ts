import { defineStore } from "pinia";

export const useEquipmentStore = defineStore("equipment", () => {
  const equipment = ref<InventoryItem[]>([]);
  const statusLoading = ref(false);
  const statusError = ref<string | null>(null);

  const fetchEquipment = async () => {
    const equipmentData = await requestEndpoint<InventoryItem[]>(
      "equipment/equipment/",
      "GET",
    );
    equipment.value = equipmentData;
  };

  const submitEquipmentStatus = async (
    equipmentName: string,
    student: Student,
    checkIn: boolean,
  ) => {
    // Validation
    if (!equipmentName || !student) {
      throw new Error("Missing equipment or student information.");
    }

    statusLoading.value = true;
    statusError.value = null;

    try {
      const payload = {
        equipment_name: equipmentName,
        student_osis: student.osis,
        status: checkIn ? "in" : "out",
      };

      const result = await tryRequestEndpoint(
        "equipment/equipment/",
        "POST",
        payload,
      );

      if (!("error" in result) && result.data) {
        return {
          success: true,
          message: `Equipment ${checkIn ? "checked in" : "checked out"} successfully!`,
        };
      } else {
        throw new Error("Failed to update equipment status");
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An error occurred. Please try again.";
      statusError.value = errorMessage;
      console.error("Store: Error submitting equipment status:", e);
      throw e;
    } finally {
      statusLoading.value = false;
    }
  };

  return {
    statusLoading,
    statusError,
    submitEquipmentStatus,
    fetchEquipment,
    equipment,
  };
});
