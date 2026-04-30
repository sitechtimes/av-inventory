import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const user = ref<User>();

  async function signIn(username: string, password: string) {
    async function fetchToken() {
      const token = await tryRequestEndpoint("api/token/", "POST", {
        username: username,
        password: password,
      });
      return token;
    }
  }
});
