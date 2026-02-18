import axios from "axios";
import type {PosProvider, PosToken, SessionUser} from "./types.ts";
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
    //console.log("API →", c.method?.toUpperCase(), c.url);
    return c;
  });
  api.interceptors.response.use(
    (r) => {
      //console.log("API ←", r.status, r.config.url);
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

export const startAuthorization = (provider: PosProvider, userId: string, shop: string | null): void => {
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
export const getPosToken = async (provider: PosProvider, merchantId?: string | null) => {
  if (!merchantId) {
    console.warn(`[pos] Skipping ${provider} token load: missing merchantId`);
    return null;
  }
  const {data} = await api.get(`/${provider}/token`, {params: {merchant_id: merchantId}}) as { data: PosToken | null };
  if (!data) return null;

  return {
    merchantId: data.merchantId,
    expiresAt: data.expiresAt,
    expiresAtMs: data.expiresAtMs,
    expiresInSeconds: data.expiresInSeconds,
  } as PosToken;
};

export const refreshPosToken = async (provider: PosProvider, merchantId?: string | null) => {
  if (!merchantId) {
    console.warn(`[pos] Skipping ${provider} token refresh: missing merchantId`);
    return null;
  }
  const {data} = await api.post(`/${provider}/refresh`, null, {params: {merchant_id: merchantId}}) as {
    data: PosToken | null
  };
  if (!data) return null;

  return {
    merchantId: data.merchantId,
    expiresAt: data.expiresAt,
    expiresAtMs: data.expiresAtMs,
    expiresInSeconds: data.expiresInSeconds
  } as PosToken;
};