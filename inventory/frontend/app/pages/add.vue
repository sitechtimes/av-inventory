<template>
  <div class="flex h-full items-center justify-center p-4 md:p-6">
    <div class="panel-shell w-full max-w-xl p-6 text-center">
      <!-- <img
          src="https://cdn.discordapp.com/attachments/1289376662814851126/1364998686785933312/IMG_1190.jpg?ex=69c21057&is=69c0bed7&hm=dab3146c0048c4d129bbfb836501a6f750f0c97227131279ba33200fc056e0bc"
          alt=""
        /> -->
      <form action="">
        <input
          ref="inputRef"
          @keydown.prevent
          @paste="handlePaste"
          @blur="inputRef?.focus()"
          v-model="inputValue"
          type="text"
          autofocus
          placeholder="Please scan the item!"
          class="opacity-0 border-none bg-transparent"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const inputValue = ref("");
const inputRef = ref<HTMLInputElement>();

const handlePaste = (event: any) => {
  event.clipboardData.getData("text/plain");
};

watch(inputValue, (newValue) => {
  console.log(newValue);
});
</script>
