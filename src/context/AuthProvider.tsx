import {type ReactNode, useEffect, useMemo, useState} from "react";
import {AuthContext, type AuthContextValue, type AuthState, type User} from "./authContext";
import {getCurrentUser} from "../services/sessionClient";

export const AuthProvider = ({children}: { children: ReactNode }) => {
  // Initialize from localStorage on first render
  const [state, setState] = useState<AuthState>(() => {
    const stored = localStorage.getItem("user");
    const user = stored ? (JSON.parse(stored) as User) : null;
    return {
      isAuthenticated: !!user,
      user,
      token: null,
    };
  });

  // Hydrate from backend session on mount only if we don't already have a user
  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      // Skip if we already have a user (from localStorage or previous session)
      if (state.user) return;

      try {
        const fetched = await getCurrentUser();
        let finalUser: User | null = fetched ?? null;

        // ENV user role OVERRIDES
        if (finalUser && import.meta.env.MODE === "visitor") {
          const roles = Array.isArray(finalUser.roles) ? [...finalUser.roles] : [];
          roles.pop();
          roles.push(import.meta.env.VITE_VISITOR_ROLE);
          finalUser = {...finalUser, roles} as User;
          console.log("Overriding user role to visitor", finalUser);
        }

        if (cancelled) return;

        if (finalUser) {
          localStorage.setItem("user", JSON.stringify(finalUser));
          setState({isAuthenticated: true, user: finalUser, token: null});
          console.log("User hydrated from backend session:", finalUser);
        } else {
          localStorage.removeItem("user");
          setState({isAuthenticated: false, user: null, token: null});
          console.log("No user found in backend session");
        }
      } catch {
        // Leave state as-is on error
      }
    };

    void hydrate();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Expose login helper and persist to localStorage
  const login = (user?: User, token?: string) => {
    setState((prev) => {
      const nextUser = user ?? prev.user;
      console.log("Logging in:", nextUser);
      if (nextUser) {
        localStorage.setItem("user", JSON.stringify(nextUser));
      } else {
        localStorage.removeItem("user");
      }
      return {
        ...prev,
        isAuthenticated: !!nextUser,
        user: nextUser,
        token: token ?? prev.token,
      };
    });
  };

  const value = useMemo<AuthContextValue>(() => ({...state, login}), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
