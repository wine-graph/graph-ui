import {useEffect, useMemo, useState, type ReactNode} from "react";
import {AuthContext, type AuthContextValue, type AuthState, type User} from "./authContext";
import {getCurrentUser} from "../services/sessionClient";

export const AuthProvider = ({children}: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  // Hydrate from backend session on mount
  useEffect(() => {
    const hydrate = async () => {
      const user = await getCurrentUser();

      if (user) {
        setState({isAuthenticated: true, user: user, token: null});
      } else {
        setState({isAuthenticated: false, user: null, token: null});
      }
      {/* ENV user role OVERRIDES */}
      if (import.meta.env.MODE === 'visitor') {
        user?.roles?.pop();
        user?.roles?.push(import.meta.env.VITE_VISITOR_ROLE);
      }
      {/* ENV user role OVERRIDES */}
    };
    void hydrate();
  }, []);

  // Expose login helper (optional)
  const login = (user?: User, token?: string) => {
    console.log("Logging in:", user);
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user: user ?? prev.user,
      token: token ?? prev.token,
    }));
  };

  const value = useMemo<AuthContextValue>(() => ({...state, login}), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
