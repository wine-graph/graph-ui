import {type ReactNode, useEffect} from "react";
import {useGoogleOidc} from "./google.ts";
import {useMachine} from "@xstate/react";
import {authMachine} from "./authMachine.ts";
import {AuthContext, type AuthContextValue} from "./authContext.ts";
import {useAuthService} from "./authSystem.tsx";
import {FullScreenSpinner} from "../components/FullScreenSpinner.tsx";
import {useNavigate} from "react-router-dom";
import {posOAuthMachine} from "./posOAuthMachine.ts";
import type {PosProvider} from "./types.ts";

/**
 * Handles OAuth redirection side effects.
 * Kept separate to prevent AuthProvider from becoming a "God Component".
 */
export const AuthManager = ({auth}: { auth: AuthContextValue }) => {
  const navigate = useNavigate();
  const google = useGoogleOidc({auth});
  const [oauthState, oauthSend] = useMachine(posOAuthMachine, {
    input: {
      fetchUser: auth.fetchUser,
      loadPos: auth.pos.load,
    },
  });

  const processingPosOAuth = oauthState.matches("processing");
  const redirectPath = oauthState.context.redirectPath;

  useEffect(() => {
    const provider = (["square", "clover", "shopify"] as PosProvider[]).find((p) => {
      return !!sessionStorage.getItem(`${p}_oauth_pending`);
    });
    if (!provider) return;
    oauthSend({type: "START", provider});
  }, [oauthSend]);

  useEffect(() => {
    if (!redirectPath) return;
    navigate(redirectPath, {replace: true});
    oauthSend({type: "RESET"});
  }, [navigate, oauthSend, redirectPath]);

  return (google.isProcessing || processingPosOAuth) ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <FullScreenSpinner label={google.isProcessing ? "Completing login..." : "Completing POS authorization..."}/>
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