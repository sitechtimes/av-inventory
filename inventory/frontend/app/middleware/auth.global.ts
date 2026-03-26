export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const isAuthenticated = await authStore.checkSession();

  if (to.path === "/login" && isAuthenticated) {
    return navigateTo("/");
  }

  if (to.path !== "/login" && !isAuthenticated) {
    return navigateTo("/login");
  }
});
