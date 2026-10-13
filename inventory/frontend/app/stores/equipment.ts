import { defineStore } from "pinia";

type EquipmentRecord = {
  name: string;
  barcode: string;
  equipment_type: string;
  owner: string;
  current_condition: string;
  status: string;
};

export const useEquipmentStore = defineStore("equipment", () => {
  const equipment = ref<EquipmentRecord[]>([]);
  const statusLoading = ref(false);
  const statusError = ref<string | null>(null);

  const fetchEquipment = async () => {
    const equipmentData = await requestEndpoint<EquipmentRecord[]>(
      "equipment/equipment/",
      "GET",
    );
    equipment.value = equipmentData;
    return equipmentData;
  };

  const findEquipmentByBarcode = async (barcode: string) => {
    const equipmentData = await fetchEquipment();
    return equipmentData.find((item) => item.barcode === barcode);
  };

  const createEquipment = async (
    equipmentName: string,
    barcode: string,
    category: string,
    currentCondition = "",
  ) => {
    const result = await tryRequestEndpoint<EquipmentRecord>(
      "equipment/equipment/",
      "POST",
      {
        name: equipmentName,
        barcode,
        equipment_type: category,
        owner: "000000000",
        current_condition: currentCondition,
      },
    );

    if (!("error" in result) && result.data) {
      equipment.value.push(result.data);
      return result.data;
    }

    throw new Error("Unable to create equipment. Check the barcode and category.");
  };

  const submitEquipmentStatus = async (
    equipmentName: string,
    student: Student,
    currentCondition: string,
  ) => {
    if (!equipmentName || !student) {
      throw new Error("Missing equipment or student information.");
    }

    statusLoading.value = true;
    statusError.value = null;

    try {
      const payload = {
        owner: student.osis,
        current_condition: currentCondition,
      };

      const result = await tryRequestEndpoint(
        `equipment/equipment/${encodeURIComponent(equipmentName)}/`,
        "PATCH",
        payload,
      );

      if (!(("error" in result) || !result.data)) {
        return {
          success: true,
          message: `Updated ${equipmentName}`,
        };
      }

      throw new Error(`Failed to assign ${equipmentName}`);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An error occurred. Please try again.";
      statusError.value = errorMessage;
      console.error("Store: Error assigning equipment:", e);
      throw e;
    } finally {
      statusLoading.value = false;
    }
  };

  const checkout = async (equipmentName: string, currentCondition: string) => {
    if (!equipmentName) {
      throw new Error("Missing equipment information.");
    }

    statusLoading.value = true;
    statusError.value = null;

    try {
      const payload = {
        owner: "000000000",
        current_condition: currentCondition,
      };

      const result = await tryRequestEndpoint(
        `equipment/equipment/${encodeURIComponent(equipmentName)}/`,
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
    findEquipmentByBarcode,
    createEquipment,
    submitEquipmentStatus,
    checkout,
    fetchEquipment,
    equipment,
  };
});
