<template>
  <div class="flex h-screen overflow-hidden font-sans">
    <!-- Icon sidebar -->
    <nav
      class="w-14 bg-[#1a1a2e] flex flex-col items-center flex-shrink-0 z-10"
    >
      <div
        class="w-14 h-14 bg-red-700 flex items-center justify-center text-white font-bold text-[22px] tracking-tight flex-shrink-0 select-none"
      >
        AV
      </div>
      <div class="flex-1 flex flex-col items-center pt-3 gap-1">
        <button
          class="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 text-white"
          title="Inventory"
        >
          <Icon name="inventory" />
        </button>
        <button
          class="w-10 h-10 rounded-lg flex items-center justify-center text-[#7a7a9a] hover:bg-white/10 hover:text-white transition-colors"
          title="Search"
        >
          <Icon name="search" />
        </button>
      </div>
      <div class="flex flex-col items-center pb-3 gap-1">
        <button
          class="w-10 h-10 rounded-lg flex items-center justify-center text-[#7a7a9a] hover:bg-white/10 hover:text-white transition-colors"
          title="History"
        >
          <Icon name="history" />
        </button>
      </div>
    </nav>

    <!-- Main content -->
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
