// Public barrel for the auth module. Prefer importing from "src/auth" in the app.

// Consolidated auth system (provider + context + service facade)
export {useAuthService} from "./authSystem";
export {AuthProvider} from "./AuthManager";

// State machine (kept separate for clarity/testability)
export {authMachine} from "./authMachine";

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
  updateRole,
  getPosToken,
  refreshPosToken,
  startAuthorization,
} from "./authClient";

// OAuth callback hooks (POS + Google)
export {useGoogleOidc} from "./google";
export {useSquareOAuth} from "./square";
export {useCloverOAuth} from "./clover";
export {useShopifyOAuth} from "./shopify";

// Storage (rarely needed by app code; exposed for utilities/tools)
export {storage} from "./storage";
