<template>
  <input
    ref="inputRef"
    :value="modelValue"
    @keydown="handleKeydown"
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

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "v") {
    return;
  }
  e.preventDefault();
};

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
    inputRef.value?.focus();
  }, 0);
};

defineExpose({
  focus: () => inputRef.value?.focus(),
});
</script>
