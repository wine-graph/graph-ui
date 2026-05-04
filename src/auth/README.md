# Auth System (`src/auth/`)

The auth module owns the browser-side session lifecycle for the Wine Graph SPA:
Google OIDC authentication, pending onboarding state, backend-backed graph user tokens, and retailer POS token status.

Public app code should import from the barrel at `src/auth` unless it is part of the auth module itself.

## Flow Overview

| Flow | Steps |
|------|-------|
| Google login | User starts `/session/authenticate` -> Google redirects back with `state` -> `/session/complete` returns a `GraphUser` |
| Existing user | `GraphUser.role` is present -> token is saved from `role.token` -> user is routed to the role profile |
| New user | `GraphUser.role` is missing -> pending user is saved in `sessionStorage` -> user is routed to `/onboarding` |
| Producer onboarding | Producer form creates the producer record -> `/session/user/create` creates the graph-auth user with the producer id as role id -> returned token is saved |
| Retailer onboarding | POS authorization completes through the provider callback -> graph-auth returns the fully onboarded retailer user |
| Session restore | Stored graph token calls `/session/me`; pending onboarding user restores `/onboarding` without a graph token |

## Files

| File | Purpose |
|------|---------|
| `index.ts` | Public barrel for app imports |
| `AuthManager.tsx` | Auth provider plus Google/POS redirect side effects |
| `authSystem.tsx` | `useAuthService` facade built from XState selectors and actions |
| `authMachine.ts` | Main auth state machine for session, onboarding role selection, and POS token status |
| `posOAuthMachine.ts` | Internal machine for POS callback completion |
| `types.ts` | `GraphUser`, role, POS types, and role helpers |
| `storage.ts` | Session storage helpers for graph token and pending onboarding user |
| `authClient.ts` | Axios client plus session/POS API helpers |
| `google.ts` | Google OIDC completion hook |

## Public Facade

`useAuth()` exposes the app-facing auth state:

- `user`: current `GraphUser | null`
- `role`: derived backend-backed role, or `null` for pending onboarding
- `authStatus`: `initializing`, `unauthenticated`, `authenticated_unonboarded`, or `authenticated_onboarded`
- `isAuthenticated`, `isOnboarded`, `isInitializing`, `isLoading`
- `login(data)`, `logout()`, `fetchUser()`
- `selectOnboardingRole(role)`, `clearOnboardingRole()`
- `pos.load(provider, merchantId)`, `pos.refresh(provider, merchantId)`, and POS status fields

Protected app routes should rely on backend-backed `role` only. Pending onboarding role selection is only for the `/onboarding` flow.

## Storage

Current dev/staging storage is browser `sessionStorage`:

- `graph_token`: JWT returned on a completed graph-auth user
- `wg_onboarding_user`: temporary Google OIDC user while onboarding is incomplete
- `wg_onboarding_role`: temporary onboarding role selection
- `{provider}_oauth_pending`: provider callback guard for POS OAuth

Production can migrate the graph token to cookies without changing the route-level onboarding model.
