interface TokenResponse {
  access: string;
  refresh: string;
}

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  const accessToken = useCookie<string | null>("access_token", {
    maxAge: 60 * 60 * 24 * 7,
  });
  const refreshToken = useCookie<string | null>("refresh_token", {
    maxAge: 60 * 60 * 24 * 7,
  });

  async function login(credentials: { username: string; password: string }) {
    const { data, error } = await tryRequestEndpoint<
      TokenResponse | { detail: string }
    >("api/token/", "POST", credentials, true);

    if (error) throw error;

    if (data && "detail" in data) throw { data };

    if (!data || !("access" in data))
      throw new Error("Invalid response from server");

    accessToken.value = data.access;
    refreshToken.value = data.refresh;
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
