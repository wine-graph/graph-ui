// Public barrel for the auth module. Prefer importing from "src/auth" in the app.

// Consolidated auth system (provider + context + service facade)
export {useAuthService} from "./authSystem";
export {AuthProvider} from "./AuthManager";

// State machine (kept separate for clarity/testability)
export {authMachine} from "./authMachine";
export {posOAuthMachine} from "./posOAuthMachine";

export {useAuth} from "./authContext";

// Types
export type {
  Role,
  SessionUser,
  User,
  UserRole,
  PosProvider,
  PosToken,
} from "./types";
export {deriveRole, hasRole} from "./types";

// Client/API helpers
export {
  api,
  startAuthentication,
  completeGoogleAuth,
  fetchCurrentUser,
  getPosToken,
  refreshPosToken,
  startAuthorization,
} from "./authClient";

// OAuth callback hooks
export {useGoogleOidc} from "./google";

// Storage (rarely needed by app code; exposed for utilities/tools)
export {storage} from "./storage";
