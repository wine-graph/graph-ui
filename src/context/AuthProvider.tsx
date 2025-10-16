import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue, type AuthState, type User } from "./authContext";
import { getCurrentUser} from "../services/sessionClient";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  // Hydrate auth state from server session on mount
  useEffect(() => {
    const hydrate = async () => {
      const user = await getCurrentUser();
      if (user) {
        setState({ isAuthenticated: true, user: user, token: null });
      } else {
        setState({ isAuthenticated: false, user: null, token: null });
      }
    };
    void hydrate();
  }, []);

  const login = (user?: User, token?: string) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user: user ?? prev.user,
      token: token ?? prev.token,
    }));
  };

  const logout = () => {
    setState({ isAuthenticated: false, user: null, token: null });
  };

  const value = useMemo<AuthContextValue>(() => ({ ...state, login, logout }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
