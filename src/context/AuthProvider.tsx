import {useEffect, useMemo, useState, type ReactNode, useRef} from "react";
import { AuthContext, type AuthContextValue, type AuthState, type User } from "./authContext";
import { getCurrentUser} from "../services/sessionClient";
import {useNavigate, useSearchParams} from "react-router-dom";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const retailerId = searchParams.get("id");
  const hasHandledCallback = useRef(false);

  // Hydrate from backend session on mount
  useEffect(() => {
    const hydrate = async () => {
      const user = await getCurrentUser();

      // merge retailerId from localStorage if we have one
      const savedRetailerId = localStorage.getItem("retailerId");

      if (user) {
        const updatedUser: User = {
          ...user,
          retailerId: user.retailerId ?? savedRetailerId ?? undefined,
        };
        setState({ isAuthenticated: true, user: updatedUser, token: null });
      } else {
        setState({ isAuthenticated: false, user: null, token: null });
      }
    };
    void hydrate();
  }, []);

  // Handle Square OAuth callback (query param ?id=...)
  useEffect(() => {
    // guard: only run once and only if we actually have both pieces
    if (hasHandledCallback.current || !retailerId || !state.user) return;
    hasHandledCallback.current = true;

    const updatedUser = { ...state.user, retailerId };
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user: updatedUser,
      loading: true
    }));

    // persist for future reloads
    localStorage.setItem("retailerId", retailerId);

    // navigate once to clean up URL and go to profile
    navigate(`/retailer/${retailerId}/profile`, { replace: true });
  }, [retailerId, state.user, navigate]);

  // Expose login helper (optional)
  const login = (user?: User, token?: string) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user: user ?? prev.user,
      token: token ?? prev.token,
    }));
  };

  const value = useMemo<AuthContextValue>(() => ({ ...state, login }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
