export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    if (to.path !== "/login") {
      return navigateTo("/login");
    }

    return;
  }

  const authStore = useAuthStore();
  const isAuthenticated = await authStore.checkSession();

  if (to.path === "/login" && isAuthenticated) {
    return navigateTo("/");
  }

  if (to.path !== "/login" && !isAuthenticated) {
    return navigateTo("/login");
  }
});
