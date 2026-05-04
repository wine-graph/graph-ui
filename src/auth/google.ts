import {useCallback, useEffect, useRef, useState} from "react";
import {completeGoogleAuth} from "./authClient";
import {useNavigate} from "react-router-dom";
import type {AuthContextValue} from "./authContext.ts";
import {deriveRole} from "./types.ts";
import {ONBOARDING_PATH, roleProfilePath} from "../app/onboarding.ts";

export const useGoogleOidc = ({auth}: { auth: AuthContextValue }) => {
  const navigate = useNavigate();
  const hasHandleRef = useRef(false);

  const [isProcessing, setIsProcessing] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("state") && !hasHandleRef.current;
  });

  const authorize = useCallback(async () => {
    if (hasHandleRef.current) return;

    const params = new URLSearchParams(location.search);
    const state = params.get("state");

    if (!state) return;
    hasHandleRef.current = true;
    setIsProcessing(true);

    try {
      const graphUser = await completeGoogleAuth(state);

      // Commit user to auth context
      auth.login(graphUser);

      const roleValue = deriveRole(graphUser.role?.value);

      // Evaluate user's destination based on role
      switch (roleValue) {
        case null:
        case undefined:
          navigate(ONBOARDING_PATH, {replace: true});
          break;

        case 'retailer':
        case 'producer': {
          navigate(roleProfilePath(graphUser), {replace: true});
          break;
        }

        default:
          // Catch-all safety net for unexpected or unhandled roles
          console.warn(`Unhandled role detected: ${roleValue}`);
          navigate('/profile', {replace: true});
          break;
      }

      // Clean URL & Session Storage
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
