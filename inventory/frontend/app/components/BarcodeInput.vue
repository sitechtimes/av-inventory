<template>
  <input
    ref="inputRef"
    :value="modelValue"
    @paste="handlePaste"
    @blur="handleBlur"
    type="text"
    autofocus
    class="opacity-0 pointer-events-none"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  paste: [text: string];
}>();

const inputRef = ref<HTMLInputElement>();

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pastedText = event.clipboardData?.getData("text/plain")?.trim();

  if (pastedText) {
    emit("update:modelValue", pastedText);
    emit("paste", pastedText);
  }
};

const handleBlur = () => {
  setTimeout(() => {
    const activeElement = document.activeElement;
    if (
      activeElement instanceof HTMLElement &&
      activeElement.matches(
        "input, select, textarea, button, [contenteditable='true']",
      )
    ) {
      return;
    }

    inputRef.value?.focus();
  }, 0);
};

defineExpose({
  focus: () => inputRef.value?.focus(),
});
</script>
