import type {GraphUser} from "./types.ts";

const TOKEN_KEY = "graph_token";
const ONBOARDING_USER_KEY = "wg_onboarding_user";

export const storage = {
  getToken: () => sessionStorage.getItem(TOKEN_KEY),

  setToken: (t: string | null) =>
    t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY),

  saveTokenFromUser: (user: GraphUser) => {
    if (user.role?.token) storage.setToken(user.role.token);
  },

  getOnboardingUser: (): GraphUser | null => {
    const raw = sessionStorage.getItem(ONBOARDING_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as GraphUser;
    } catch {
      sessionStorage.removeItem(ONBOARDING_USER_KEY);
      return null;
    }
  },

  saveOnboardingUser: (user: GraphUser) => {
    sessionStorage.setItem(ONBOARDING_USER_KEY, JSON.stringify(user));
  },

  clearOnboardingUser: () => {
    sessionStorage.removeItem(ONBOARDING_USER_KEY);
  },

  clear: () => {
    storage.setToken(null);
    storage.clearOnboardingUser();
  },
};
