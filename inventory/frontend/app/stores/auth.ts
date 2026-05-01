import { defineStore } from "pinia";

type Response = {
  access: string;
  refresh: string;
};

export const useUserStore = defineStore("user", () => {
  const user = ref<User>();
  const authToken = useCookie("auth-token", {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });

  async function signIn(username: string, password: string) {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    try {
      const result = await tryRequestEndpoint<Response>("api/token/", "POST", {
        username: username,
        password: password,
      });

      if (!("error" in result) && result.data) {
        authToken.value = result.data;
        return result.data;
      }

      throw new Error("Failed to fetch token");
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    }
  }

  return { user, authToken, signIn };
});
