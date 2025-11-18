# Auth System (`src/auth/`)

A **type-safe, XState-powered** authentication layer for your Quarkus-backed SPA.

---

## Flow Overview

| Flow | Steps |
|------|-------|
| **Google Login** | Click → `/session/authenticate` → Google → `/session/complete?state=xyz` → `auth.login()` |
| **Square Connect** | Click → `/square/authorize` → Square → `/square/callback` → **302 + cookie** → `/retailer?id=123` → `useSquareOAuth` → `/square/status` → `auth.refresh()` |

> **No frontend POST to `/callback`** — Quarkus handles it.

---

## Files

| File | Purpose |
|------|--------|
| `types.ts` | `SessionUser`, `Role`, `AuthContextValue` |
| `storage.ts` | Persist user/token |
| `services/authClient.ts` | Axios + interceptors + logs |
| `authMachine.ts` | **State machine** — one source of truth |
| `useAuth.ts` | Hook to read state + send events |
| `google.ts` | Handle Google redirect |
| `pos/square.ts` | Handle Square redirect + `/status` |
| `AuthProvider.tsx` | Mount machine + run redirects |

---

## State Machine
