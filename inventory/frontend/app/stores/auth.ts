type LoginPayload = {
  username: string;
  password: string;
};

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const username = ref<string | null>(null);

  let sessionChecked = false;

  async function login(payload: LoginPayload) {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase ?? "";

    const response = await $fetch<{ username?: string }>(
      `${apiBase}/api/auth/login/`,
      {
        method: "POST",
        credentials: "include",
        body: {
          username: payload.username.trim(),
          password: payload.password,
        },
      },
    );

    isAuthenticated.value = true;
    username.value = response.username ?? payload.username.trim();
    sessionChecked = true;
  }

  async function checkSession(force = false) {
    if (sessionChecked && !force) {
      return isAuthenticated.value;
    }

    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase ?? "";

    try {
      const response = await $fetch<{
        authenticated: boolean;
        username?: string;
      }>(`${apiBase}/api/auth/session/`, {
        credentials: "include",
      });

      isAuthenticated.value = response.authenticated;
      username.value = response.authenticated
        ? (response.username ?? null)
        : null;
    } catch {
      isAuthenticated.value = false;
      username.value = null;
    }

    sessionChecked = true;
    return isAuthenticated.value;
  }

  async function logout() {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase ?? "";

    try {
      await $fetch(`${apiBase}/api/auth/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    isAuthenticated.value = false;
    username.value = null;
    sessionChecked = true;
  }

  return {
    username,
    isAuthenticated,
    login,
    checkSession,
    logout,
  };
});
