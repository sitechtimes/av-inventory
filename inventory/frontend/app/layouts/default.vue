<template>
  <div class="flex h-screen overflow-hidden font-sans">
    <Sidebar />

    <main class="flex-1 flex flex-col overflow-hidden bg-[#f7f7fb]">
      <slot />
    </main>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
</style>
