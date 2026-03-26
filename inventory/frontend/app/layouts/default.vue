<template>
  <div class="h-screen overflow-hidden bg-base-200">
    <div
      class="mx-auto flex h-full max-w-[1500px] flex-col gap-4 p-4 lg:flex-row"
    >
      <aside class="panel-shell w-full shrink-0 p-3 lg:w-64">
        <div class="mb-5 flex items-center gap-3 px-2">
          <div class="avatar placeholder">
            <div class="h-10 w-10 rounded-lg bg-primary text-primary-content">
              <span class="text-sm font-bold">AV</span>
            </div>
          </div>
          <div>
            <p class="text-sm font-semibold">Inventory</p>
          </div>
        </div>

        <nav class="grid grid-cols-3 gap-2 lg:grid-cols-1">
          <NuxtLink
            to="/"
            class="btn-app btn-app-ghost justify-start"
            :class="isActive('/') ? 'btn-active' : ''"
          >
            <Icon name="lucide:package" class="text-base" />
            Inventory
          </NuxtLink>
          <NuxtLink
            to="/students"
            class="btn-app btn-app-ghost justify-start"
            :class="isActive('/students') ? 'btn-active' : ''"
          >
            <Icon name="lucide:users" class="text-base" />
            Students
          </NuxtLink>
          <NuxtLink
            to="/add"
            class="btn-app btn-app-ghost justify-start"
            :class="isActive('/add') ? 'btn-active' : ''"
          >
            <Icon name="lucide:plus-square" class="text-base" />
            Add
          </NuxtLink>
        </nav>

        <div class="mt-4 border-t border-base-300 pt-4">
          <button
            class="btn-app btn-app-outline w-full justify-start"
            @click="handleLogout"
          >
            <Icon name="lucide:log-out" class="text-base" />
            Logout
          </button>
        </div>
      </aside>

      <main class="panel-shell min-h-0 flex-1 overflow-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const authStore = useAuthStore();

function isActive(path: string) {
  return route.path === path;
}

async function handleLogout() {
  authStore.logout();
  await navigateTo("/login");
}
</script>
