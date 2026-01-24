import {useCallback, useState} from "react";
import {completeGoogleAuth} from "./authClient";
import {useNavigate} from "react-router-dom";
import type {AuthContextValue} from "./authContext.ts";

export const useGoogleOidc = ({auth}: { auth: AuthContextValue}) => {
  const navigate = useNavigate();
  // backend sends state param to redirect back to this page and use for confirmation after login
  const [isProcessing, setIsProcessing] = useState(() => {
    return new URLSearchParams(location.search).has("state");
  });

  const authorize = useCallback(async () => {
    const params = new URLSearchParams(location.search);
    const state = params.get("state");

    if (!state) return;

    setIsProcessing(true);

    try {
      const sessionUser = await completeGoogleAuth(state);
      auth.login(sessionUser);

      if (sessionUser.user.role.value === 'retailer') {
        const retailerId = sessionUser.user.role.id;
        navigate(`/retailer/${retailerId}/profile`, {replace: true});
      }

      // Clean URL
      params.delete("state");
      const cleanPath = `${location.pathname}${params.toString() ? "?" + params : ""}${location.hash}`;
      window.history.replaceState({}, "", cleanPath);
    } catch (error) {
      console.error("Google OIDC failed:", error);
      // Optional: show toast
    } finally {
      setIsProcessing(false);
    }
  }, [auth, navigate]);

  return {authorize, isProcessing};
};