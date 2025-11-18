import {type ReactNode, useEffect} from "react";
import {useMachine} from "@xstate/react";
import {AuthContext} from "./authContext";
import {authMachine} from "./authMachine";
import {useAuthService} from "./useAuthService.ts";
import {useGoogleOidc} from "./google";
import {useSquareOAuth} from "./square.ts";
import {FaSpinner} from "react-icons/fa6";

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

  // CORRECT: matches({ authenticated: "idle" })
  if (state.matches("loading") || google.isProcessing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <FaSpinner className="animate-spin text-4xl"/>
      </div>
    );
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};