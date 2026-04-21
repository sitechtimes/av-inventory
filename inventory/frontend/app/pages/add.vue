<template>
  <div class="flex h-full items-center justify-center p-4 md:p-6">
    <button @click="fetchUsers">SELECT STUDENT</button>
    <button @click="status = false">Scan out</button>
    <button @click="status = true">Scan in</button>
    <div class="panel-shell w-full max-w-xl p-6 text-center">
      <!-- <img
          src="https://cdn.discordapp.com/attachments/1289376662814851126/1364998686785933312/IMG_1190.jpg?ex=69c21057&is=69c0bed7&hm=dab3146c0048c4d129bbfb836501a6f750f0c97227131279ba33200fc056e0bc"
          alt=""
        /> -->
      <form action="">
        <input
          ref="inputRef"
          @keydown="handleKeydown"
          @paste="handlePaste"
          @blur="inputRef?.focus()"
          v-model="inputValue"
          type="text"
          autofocus
          class="opacity-0 border-none bg-transparent"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const inputValue = ref("");
const inputRef = ref<HTMLInputElement>();

const status = ref<boolean>();

const createEquipment = async () => {
  try {
    const response = await $fetch("http://localhost:8000/equipment/", {
      method: "POST",
      body: {
        // name: "Laptop",
        // equipment_type: "Dell XPS 13",
        // owner: 1200,
        // current_condition: "New",
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const fetchUsers = async () => {
  try {
    const response = await $fetch("http://localhost:8000/student/students/", {
      method: "GET",
    });
    console.log(response);
  } catch (e) {
    console.error(e);
  }
};

const handlePaste = (event: any) => {
  event.clipboardData.getData("text/plain");
};

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "v") {
    return;
  }
  e.preventDefault();
};

watch(inputValue, (newValue) => {
  console.log(newValue);
});
</script>
