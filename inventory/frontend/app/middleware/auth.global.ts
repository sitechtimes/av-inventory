export default defineNuxtRouteMiddleware((to) => {
  const accessToken = useCookie("access_token");

  if (to.path === "/login") {
    return;
  }

  if (!accessToken.value) {
    return navigateTo("/login");
  }
});
