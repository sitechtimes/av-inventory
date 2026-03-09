/
<script setup lang="ts">
const props = defineProps<{ name: string; size?: string }>();
const sz = computed(() => props.size ?? "18px");
</script>

<template>
  <span
    class="block bg-current flex-shrink-0"
    :style="{
      width: sz,
      height: sz,
      maskImage: `url('/icons/${name}.svg')`,
      WebkitMaskImage: `url('/icons/${name}.svg')`,
      maskSize: 'contain',
      maskRepeat: 'no-repeat',
      maskPosition: 'center',
    }"
  />
</template>
