<template>
  <div></div>
</template>

<script setup lang="ts">
async function fetchToken() {
  const token = await tryRequestEndpoint("api/token/", "POST", {
    username: "admin",
    password: "admin",
  });
  return token;
}

console.log(await fetchToken());
</script>
