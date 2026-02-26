import {useCallback, useEffect, useRef, useState} from "react";
import {completeGoogleAuth} from "./authClient";
import {useNavigate} from "react-router-dom";
import type {AuthContextValue} from "./authContext.ts";

export const useGoogleOidc = ({auth}: { auth: AuthContextValue}) => {
  const navigate = useNavigate();
  const hasHandleRef = useRef(false);

  const [isProcessing, setIsProcessing] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("state") && !hasHandleRef.current;
  });

  const authorize = useCallback(async () => {
    console.log("[google] authorize called")

    if (hasHandleRef.current) return;

    const params = new URLSearchParams(location.search);
    const state = params.get("state");

    if (!state) return;
    hasHandleRef.current = true;
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

      // Clear pending flag if present
      sessionStorage.removeItem("google_oauth_pending");
    } catch (error) {
      console.error("Google OIDC failed:", error);
      hasHandleRef.current = false;
    } finally {
      setIsProcessing(false);
    }
  }, [auth, navigate]);

  // One-shot effect: run only when component mounts + state is present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("state") && !hasHandleRef.current) {
      authorize();
    }
  }, [authorize]);

  return {authorize, isProcessing};
};