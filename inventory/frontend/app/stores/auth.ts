interface TokenResponse {
  access: string;
  refresh: string;
}

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const response = ref<any>();

  const accessToken = useCookie<string | null>("access_token", {
    maxAge: 60 * 60 * 24 * 7,
  });
  const refreshToken = useCookie<string | null>("refresh_token", {
    maxAge: 60 * 60 * 24 * 7,
  });

  async function login(credentials: { username: string; password: string }) {
    try {
      const data = await requestEndpoint<TokenResponse>(
        "api/token/",
        "POST",
        credentials,
        true,
      );
      response.value = data;
    } catch (err) {
      console.error(err);
    }

    if (!response.value || !("access" in response.value))
      throw new Error("Invalid response from server");

    accessToken.value = response.value.access;
    refreshToken.value = response.value.refresh;
  }

  function logout() {
    accessToken.value = null;
    refreshToken.value = null;
    router.push("/login");
  }

  return {
    accessToken,
    refreshToken,
    login,
    logout,
  };
});
