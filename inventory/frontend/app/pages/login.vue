<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-200 px-4 py-10"
  >
    <div
      class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
    />
    <div
      class="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"
    />

    <div class="panel-shell relative w-full max-w-md p-6 sm:p-8">
      <div class="mb-6 flex items-center gap-3">
        <div>
          <h1 class="text-xl font-bold">AV Inventory</h1>
        </div>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <label class="form-control w-full">
          <div class="label pb-1">
            <span class="label-text font-medium">Username</span>
          </div>
          <input
            v-model="username"
            type="text"
            class="input input-bordered w-full"
            autocomplete="username"
            required
          />
        </label>

        <label class="form-control w-full">
          <div class="label pb-1">
            <span class="label-text font-medium">Password</span>
          </div>
          <input
            v-model="password"
            type="password"
            class="input input-bordered w-full"
            autocomplete="current-password"
            required
          />
        </label>

        <p
          v-if="errorMessage"
          class="rounded-lg bg-error/15 px-3 py-2 text-sm text-error"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="btn btn-primary w-full"
          :disabled="isSubmitting"
        >
          <span
            v-if="isSubmitting"
            class="loading loading-spinner loading-sm"
          />
          <span>{{ isSubmitting ? "Signing in..." : "Sign in" }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: false,
});

const authStore = useAuthStore();
const username = ref("");
const password = ref("");
const errorMessage = ref("");
const isSubmitting = ref(false);

async function handleSubmit() {
  errorMessage.value = "";
  isSubmitting.value = true;

  try {
    await authStore.login({
      username: username.value,
      password: password.value,
    });

    await navigateTo("/");
  } catch (error: unknown) {
    const fallbackMessage =
      "Unable to sign in. Check your username and password.";
    if (error && typeof error === "object" && "data" in error) {
      const data = (error as { data?: Record<string, unknown> }).data;
      if (data && typeof data.detail === "string") {
        errorMessage.value = data.detail;
      } else {
        errorMessage.value = fallbackMessage;
      }
    } else {
      errorMessage.value = fallbackMessage;
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>
