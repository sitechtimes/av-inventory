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
    console.log(equipment.value);
  };

  const submitEquipmentStatus = async (
    equipmentName: string,
    student: Student,
  ) => {
    if (!equipmentName || !student) {
      throw new Error("Missing equipment or student information.");
    }

    statusLoading.value = true;
    statusError.value = null;

    try {
      const payload = {
        owner: student.osis,
      };

      const result = await tryRequestEndpoint(
        `equipment/equipment/${equipmentName}/`,
        "PATCH",
        payload,
      );

      if (result) console.log(`updated ${equipmentName}`);
    } catch (e) {
      console.error(e);
    }
  };

  const checkout = async (equipmentName: string) => {
    if (!equipmentName) {
      throw new Error("Missing equipment information.");
    }

    statusLoading.value = true;
    statusError.value = null;

    try {
      const payload = {
        owner: "000000000",
      };

      const result = await tryRequestEndpoint(
        `equipment/equipment/${equipmentName}/`,
        "PATCH",
        payload,
      );

      if (!("error" in result) && result.data) {
        return {
          success: true,
          message: "Equipment checked out successfully!",
        };
      } else {
        throw new Error("Failed to checkout equipment");
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An error occurred. Please try again.";
      statusError.value = errorMessage;
      console.error("Store: Error checking out equipment:", e);
      throw e;
    } finally {
      statusLoading.value = false;
    }
  };

  return {
    statusLoading,
    statusError,
    submitEquipmentStatus,
    checkout,
    fetchEquipment,
    equipment,
  };
});
