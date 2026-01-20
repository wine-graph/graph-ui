import {type ReactNode, useEffect} from "react";
import {useMachine} from "@xstate/react";
import {AuthContext} from "./authContext";
import {authMachine} from "./authMachine";
import {useAuthService} from "./useAuthService.ts";
import {useGoogleOidc} from "./google";
import {useSquareOAuth} from "./square.ts";
import {useCloverOAuth} from "./clover.ts";
import {useShopifyOAuth} from "./shopify.ts";
import Spinner from "../components/common/Spinner";

export const AuthProvider = ({children}: { children: ReactNode }) => {

  const [state, , actor] = useMachine(authMachine, {});

  const auth = useAuthService(actor);

  const google = useGoogleOidc({auth});
  useEffect(() => {
    google.authorize();
  }, [google]);

  const square = useSquareOAuth({auth});
  // Handle Square OAuth explicitly through the 'square_oauth_pending' flag
  useEffect(() => {
    const pending = sessionStorage.getItem("square_oauth_pending");
    if (!pending) return;

    square.authenticate();
  }, [square]);

  // Handle Clover OAuth
  const clover = useCloverOAuth({auth});
  useEffect(() => {
    const pending = sessionStorage.getItem("clover_oauth_pending");
    if (!pending) return;
    clover.authenticate();
  }, [clover]);

  // Handle Shopify OAuth
  const shopify = useShopifyOAuth({auth});
  useEffect(() => {
    const pending = sessionStorage.getItem("shopify_oauth_pending");
    if (!pending) return;
    shopify.authenticate();
  }, [shopify]);

  // NOTE: Do not trigger onboarding automatically on page load. Onboarding is a one-time, explicit flow.

  // CORRECT: matches({ authenticated: "idle" })
  if (state.matches("loading") || google.isProcessing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner label="Authenticating…" />
      </div>
    );
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};