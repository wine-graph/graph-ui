# Auth System (`src/auth/`)

A type-safe, XState-powered authentication layer for the Wine Graph SPA.

This module centralizes the React provider, consumer hook, and facade for auth in a single consolidated file (`authSystem.tsx`) while keeping the XState machine (`authMachine.ts`) separate as the single source of truth for state logic. Public consumers should import from the barrel `src/auth` only.

## How it all works together:
- The Context (authContext.ts): Creates a "bucket" that holds the auth object so any component can reach in and grab it using useAuth().
- The Hook (useAuth): When you call const { isRetailer, currentPosToken } = useAuth(), you are actually calling useAuthService.
- The Selectors: useSelector ensures that your component only re-renders if the specific piece of auth data it cares about changes.
- The POS Logic: posStatus.ts contains the pure functions (like checking if a token is expired). The useAuthService hook calls these functions so your components don't have to calculate dates manually.

---

## Flow Overview

| Flow | Steps |
|------|-------|
| Google Login | Click → `/session/authenticate` → Google → `/session/complete?state=xyz` → `auth.login()` |
| Square Connect | Click → `/square/authorize` → Square → callback → server sets session → redirects to `/retailer?id=123` → `useSquareOAuth` → `auth.loadPos` → `auth.fetchUser` |
| Clover Connect | Same as Square, different provider path |
| Shopify Connect | Click → shop capture → `/shopify/authorize?shop=...` → callback → server redirects → `useShopifyOAuth` → `auth.loadPos` → `auth.fetchUser` |

Notes:
- No frontend POST to provider callbacks; the backend (Quarkus) completes the OAuth flow and redirects the browser back with query params.
- We gate provider OAuth completion with `sessionStorage` flags like `square_oauth_pending` to avoid running on normal navigations.

---

## Files

| File | Purpose |
|------|--------|
| `index.ts` | Public barrel: import everything from `src/auth` |
| `authSystem.tsx` | Consolidated module: `AuthProvider`, `AuthContext`/`useAuth`, and `useAuthService` facade (selectors + actions) |
| `authMachine.ts` | XState machine — single source of truth for state logic |
| `types.ts` | `SessionUser`, `Role`, POS types and helpers (`deriveRole`, `hasRole`) |
| `storage.ts` | Persist user/token in web storage |
| `authClient.ts` | Axios client + auth/session/POS helpers |
| `google.ts` | Google OIDC completion hook |
| `square.ts` | Square OAuth completion hook |
| `clover.ts` | Clover OAuth completion hook |
| `shopify.ts` | Shopify OAuth completion hook |
| `authContext.ts` | Re-export shim: re-exports `AuthContext` and `useAuth` from `authSystem.tsx` |
| `AuthProvider.tsx` | Re-export shim: re-exports `AuthProvider` from `authSystem.tsx` |
| `useAuthService.ts` | Re-export shim: re-exports `useAuthService` (for deep import compatibility) |

---

## Public imports (barrel)

Always import from the barrel to keep call sites stable:

```ts
import { AuthProvider, useAuth } from "../auth";
import { startAuthentication, useSquareOAuth } from "../auth";
import type { Role, PosToken } from "../auth";
```

---

## Facade shape (useAuth)

`useAuth()` returns a stable facade used across the app. Key fields and actions include:

- State:
  - `user`: `SessionUser | null`
  - `isAuthenticated`: boolean
  - `isLoading`: boolean
  - `role`: derived `Role` (respects a temporary local override during onboarding)
  - POS: `currentProvider`, `currentPosToken`, `isAuthorized`, `posLoading`, `posError`
- Actions:
  - `login(data: SessionUser)` / `logout()`
  - `fetchUser(): Promise<SessionUser | null>`
  - `loadPos(provider, merchantId)` / `refreshPos(provider, merchantId)`
  - `updateRole(nextRole: Role, roleId: string)`
  - `setLocalRole(role: Role)` / `clearLocalRole()` (onboarding aid)

Machine-specific details remain encapsulated; consumers should stick to the facade.

---

## Rationale for consolidation

- Reduced file-hopping: provider, context, and service facade are co-located.
- Machine isolation: `authMachine.ts` stays separate for clarity and testability.
- Stable public surface: the barrel exports keep imports consistent across the app.

---

## Legacy shims

The following files exist as thin re-export shims to preserve deep imports and ease migration.
They may be kept indefinitely for stability, or removed in a future cleanup once all imports are verified to go through the barrel:

- `src/auth/authContext.ts`
- `src/auth/AuthProvider.tsx`
- `src/auth/useAuthService.ts`

Recommendation: prefer importing from the barrel (`src/auth`) and treat deep imports as internal.

---

## State Machine

`authMachine.ts` defines the full state logic, including POS token actors, role attach windows, and storage hydration.
Use the facade actions rather than sending raw machine events from the UI.
