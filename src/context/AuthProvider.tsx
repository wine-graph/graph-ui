import {type ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {AuthContext, type AuthContextValue, type AuthState, type SessionUser} from "./authContext";
import {completeAuth, getCurrentUser} from "../services/authClient";

export const AuthProvider = ({children}: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    try {
      const storedUserStr = localStorage.getItem("user");
      const storedToken = sessionStorage.getItem("token");
      const parsed = storedUserStr ? JSON.parse(storedUserStr) : null;
      const isSessionUser = !!parsed && typeof parsed === "object" && "user" in parsed && "token" in parsed;
      const user = isSessionUser ? (parsed as SessionUser) : null;
      if (!isSessionUser && storedUserStr) {
        // Clean up legacy or corrupt value that stored only the inner user
        localStorage.removeItem("user");
      }
      return {
        isAuthenticated: !!user && !!storedToken,
        user,
      };
    } catch {
      // Corrupt storage – clear it so the app can recover
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      return { isAuthenticated: false, user: null };
    }
  });

  // keep local and session storage in sync with the full SessionUser shape
  useEffect(() => {
    if (state.user) localStorage.setItem("user", JSON.stringify(state.user));
    else localStorage.removeItem("user");

    if (state.user?.token) sessionStorage.setItem("token", state.user.token);
    else sessionStorage.removeItem("token");
  }, [state.user, state.user?.token]);

  // Rehydrate user on refresh if we have a token but no user (e.g., from older builds that stored only inner user)
  useEffect(() => {
    if (state.user) return;
    const token = sessionStorage.getItem("token");
    if (!token) return;
    (async () => {
      try {
        const fetched = await getCurrentUser(token);
        setState(prev => ({ ...prev, user: fetched, isAuthenticated: true }));
      } catch (e) {
        console.error("Failed to rehydrate user from token:", e);
      }
    })();
  }, [state.user]);

  // handle redirect back after Google OIDC (with ?state=xyz)
  useEffect(() => {
    const urlState = new URLSearchParams(window.location.search).get("state");
    if (!urlState) return;
    (async () => {
      try {
        console.log("redirecting back from Google OIDC with state:", urlState);
        const data = await completeAuth(urlState);
        setState(authState => ({...authState, user: data, isAuthenticated: true}));
        // remove the query param for a clean URL
        window.history.replaceState({}, document.title, "/profile");
      } catch (err) {
        console.error("Failed to complete auth:", err);
      }
    })();
  }, []);

  // optional: rehydrate user using token
  const refreshUser = useCallback(async (): Promise<SessionUser | null> => {
    const token = state.user?.token;
    if (!token) throw new Error("No token to refresh user");
    console.log("refreshing user");
    try {
      const fetched = await getCurrentUser(token);
      setState(prev => ({ ...prev, user: fetched, isAuthenticated: !!fetched }));
      return fetched;
    } catch {
      return state.user;
    }
  }, [state.user?.token]);

  // Handle redirect back after Square OAuth
  useEffect(() => {
    // Only run if we previously initiated Square auth
    const pending = sessionStorage.getItem("squareAuthPending");
    if (!pending) return;

    const url = new URL(window.location.href);
    const hasRetailerParam = url.searchParams.has("id");
    const isRetailerPath = window.location.pathname.includes("/retailer");
    const isSquareCallback = isRetailerPath || hasRetailerParam; // support old and new redirects
    if (!isSquareCallback) return;

    (async () => {
      try {
        console.log("Square OAuth redirect detected; refreshing user...");
        await refreshUser(); // this will also update local/session storage via the existing effect
      } catch (err) {
        console.error("Failed to refresh user after Square OAuth:", err);
      } finally {
        // Clean up the marker and the query param for a clean URL
        sessionStorage.removeItem("squareAuthPending");
        if (isRetailerPath) {
          window.history.replaceState({}, document.title, "/retailer");
        } else if (hasRetailerParam) {
          // strip query string but keep current path
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    })();
  }, [refreshUser]);

  const login = useCallback((user?: SessionUser, token?: string) => {
    setState(prev => ({
      ...prev,
      isAuthenticated: !!user && !!token,
      user: user ?? prev.user
    }));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({...state, login, refreshUser}),
    [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};