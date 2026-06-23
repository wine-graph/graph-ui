// Public barrel for the auth module. Prefer importing from "src/auth" in the app.

// Consolidated auth system (provider + context + service facade)
export {useAuthService} from "./authSystem";
export {AuthProvider} from "./AuthManager";

export {useAuth} from "./authContext";

// Types
export type {
  GraphUser,
  Role,
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
  exchangeRetailerSession,
  fetchCurrentUser,
  createSessionUser,
  getPosToken,
  refreshPosToken,
  startAuthorization,
} from "./authClient";

// OAuth callback hooks
export {useGoogleOidc} from "./google";

// Storage (rarely needed by app code; exposed for utilities/tools)
export {storage} from "./storage";
