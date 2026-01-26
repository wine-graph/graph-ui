import axios from "axios";
import type {Role, SessionUser} from "./types.ts";
import {storage} from "./storage.ts";

const BASE_URL = import.meta.env.DEV
  ? "http://localhost:8082"
  : "https://graph-auth.fly.dev";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // disable since we aren't using cookies for auth
});

// todo use later when we move to RBAC in backend
// === Auto-add Bearer token ===
// api.interceptors.request.use((config) => {
//   const token = storage.getToken();
//   console.log("AuthClient token:", token);
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// === Debug logs (dev only) ===
if (import.meta.env.DEV) {
  api.interceptors.request.use((c) => {
    console.log("API →", c.method?.toUpperCase(), c.url);
    return c;
  });
  api.interceptors.response.use(
    (r) => {
      console.log("API ←", r.status, r.config.url);
      return r;
    },
    (e) => {
      console.error("API ERROR", e.response?.status, e.config?.url);
      return Promise.reject(e);
    }
  );
}

// manual OIDC start
export function startAuthentication(): void {
  window.location.assign(`${BASE_URL}/session/authenticate`);
}

// === Google OIDC ===
export const completeGoogleAuth = async (state: string): Promise<SessionUser> => {
  const {data} = await api.get("/session/complete", {params: {state}});
  return data;
};

// === Who am I? ===
export const fetchCurrentUser = async (): Promise<SessionUser> => {
  const token = storage.getToken();
  const {data} = await api.get("/session/user", {
    headers: {Authorization: `Bearer ${token}`},
  });
  return data;
};

// === Update role (server is the source of truth) ===
export const updateRole = async (
  role: Role,
  roleId: string
): Promise<SessionUser> => {
  // Try session token first; if missing (edge cases), fall back to stored user.token
  let token = storage.getToken();
  if (!token) {
    const stored = storage.getUser();
    if (stored?.token) {
      token = stored.token;
      // Heal session for the rest of the session
      storage.setToken(token);
      if (import.meta.env.DEV) {
        console.warn("[authClient] session token missing; recovered from stored user");
      }
    }
  }

  // Backend expects RoleEnum uppercase. Send uppercase to avoid 400.
  const body = { role: role.toUpperCase(), id: roleId } as unknown as { role: string };

  if (import.meta.env.DEV) {
    // Do not log sensitive token; only log presence
    console.info("[authClient] updateRole → PATCH /session/user", {
      role: body.role,
      id: roleId,
      hasToken: !!token,
    });
  }

  const {data} = await api.patch(
    "/session/user",
    body,
    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
  );

  if (import.meta.env.DEV) {
    console.info("[authClient] updateRole ← success");
  }
  return data;
};

export const startAuthorization = (provider: "square" | "clover" | "shopify", userId: string, shop: string | null): void => {
  if (!userId) {
    console.warn(`Cannot start ${provider} OAuth: missing userId`);
    return;
  }
  const key = `${provider}_oauth_pending`;
  sessionStorage.setItem(key, "true");

  // For Shopify, pass the shop value as provided by the user. Backend will normalize it.
  if (provider === "shopify") {
    const provided = shop ?? "";
    if (!provided) {
      console.warn("Shopify OAuth requires a shop value");
      sessionStorage.removeItem(key);
      return;
    }
    // Swagger: /{provider}/authorize?userId=...&shop=...
    window.location.assign(`${BASE_URL}/${provider}/authorize?user_id=${encodeURIComponent(userId)}&shop=${encodeURIComponent(provided)}`);
    return;
  }

  // Square / Clover don't require extra params
  // Swagger: /{provider}/authorize?userId=...
  window.location.assign(`${BASE_URL}/${provider}/authorize?user_id=${encodeURIComponent(userId)}`);
};

// === POS: Only status & refresh ===
export const getPosToken = async (provider: "square" | "clover" | "shopify", merchantId?: string | null) => {
  if (!merchantId) {
    console.warn(`[pos] Skipping ${provider} token load: missing merchantId`);
    return null;
  }
  // Swagger: GET /{provider}/token?merchantId=...
  const {data} = await api.get(`/${provider}/token`, {params: {merchant_id: merchantId}});

  if (!data) return null;
  const expiry = pickExpiryMs(data);

  return {
    merchantId: data.merchantId ?? data.merchant_id ?? "",
    expiry,
    token: data.token ?? undefined,
  } as { merchantId: string; expiry: number | null; token?: string };
};

export const refreshPosToken = async (provider: "square" | "clover" | "shopify", merchantId?: string | null) => {
  if (!merchantId) {
    console.warn(`[pos] Skipping ${provider} token refresh: missing merchantId`);
    return null;
  }
  // Swagger: POST /{provider}/refresh?merchantId=...
  const {data} = await api.post(`/${provider}/refresh`, null, {params: {merchant_id: merchantId}});
  if (!data) return null;
  const expiry = pickExpiryMs(data);
  return {
    merchantId: data.merchantId ?? data.merchant_id ?? "",
    expiry,
    token: data.token ?? undefined,
  } as { merchantId: string; expiry: number | null; token?: string };
};

// === Expiry selection: backend exposes multiple fields; prefer ms when present ===
function pickExpiryMs(data: any): number | null {
  // 1) Prefer numeric epoch ms directly
  const ms = data?.expiresAtMs;
  if (typeof ms === "number" && Number.isFinite(ms) && ms > 0) return Math.round(ms);

  // 2) If ISO string Instant exists, parse it
  const iso = data?.expiresAt ?? "";
  if (typeof iso === "string" && iso.trim()) {
    // Trim fractional seconds beyond ms precision to avoid parse inconsistencies
    const trimmed = iso.replace(/\.(\d{3})\d+(Z|[+\-]\d{2}:\d{2})$/, ".$1$2");
    const parsed = Date.parse(trimmed);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  // 3) As a fallback, if seconds TTL provided, convert relative seconds to absolute ms
  const secs = data?.expiresInSeconds;
  if (typeof secs === "number" && Number.isFinite(secs) && secs > 0) {
    return Date.now() + Math.round(secs * 1000);
  }

  return null;
}