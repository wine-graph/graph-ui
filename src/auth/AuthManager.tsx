import {type ReactNode, useEffect} from "react";
import {useShopifyOAuth} from "./shopify.ts";
import {useCloverOAuth} from "./clover.ts";
import {useSquareOAuth} from "./square.ts";
import {useGoogleOidc} from "./google.ts";
import {useMachine} from "@xstate/react";
import {authMachine} from "./authMachine.ts";
import {AuthContext, type AuthContextValue} from "./authContext.ts";
import {useAuthService} from "./authSystem.tsx";
import {FullScreenSpinner} from "../components/FullScreenSpinner.tsx";

/**
 * Handles OAuth redirection side effects.
 * Kept separate to prevent AuthProvider from becoming a "God Component".
 */
export const AuthManager = ({auth}: { auth: AuthContextValue }) => {
  const google = useGoogleOidc({auth});
  const square = useSquareOAuth({auth});
  const clover = useCloverOAuth({auth});
  const shopify = useShopifyOAuth({auth});

  useEffect(() => {
    if (sessionStorage.getItem("square_oauth_pending")) square.authenticate();
  }, [square]);
  useEffect(() => {
    if (sessionStorage.getItem("clover_oauth_pending")) clover.authenticate();
  }, [clover]);
  useEffect(() => {
    if (sessionStorage.getItem("shopify_oauth_pending")) shopify.authenticate();
  }, [shopify]);

  return google.isProcessing ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <FullScreenSpinner label="Completing login..."/>
    </div>
  ) : null;
};

export const AuthProvider = ({children}: { children: ReactNode }) => {
  const [, , actor] = useMachine(authMachine);
  const auth = useAuthService(actor);

  if (auth.isInitializing) {
    return <FullScreenSpinner label="Setting up your session..."/>
  }

  return (
    <AuthContext.Provider value={auth}>
      <AuthManager auth={auth}/>
      {children}
    </AuthContext.Provider>
  );
};