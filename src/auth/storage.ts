import type {SessionUser} from "./types";

const USER_KEY = "graph_user";
const TOKEN_KEY = "graph_token";

export const storage = {

  getToken: () => sessionStorage.getItem(TOKEN_KEY),

  setToken: (t: string | null) =>
    t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY),

  getUser: (): SessionUser | null => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error("storage.getUser parse error", err);
      return null;
    }
  },

  setUser: (user: SessionUser | null) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    storage.setToken(user?.token ?? null);
  },

  clear: () => {
    localStorage.removeItem(USER_KEY);
    storage.setToken(null);
  }

};