import axios from "axios";
import type {SessionUser} from "./types.ts";
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
export const saveRole = async (
  role: "retailer" | "producer" | "enthusiast"
): Promise<SessionUser> => {
  const token = storage.getToken();
  // Backend expects RoleEnum, which is typically uppercase. Send uppercase to avoid 400.
  const body = { role: role.toUpperCase() } as unknown as { role: string };
  const {data} = await api.patch(
    "/session/user",
    body,
    {headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"}}
  );
  return data;
};

export const startAuthorization = (userId: string): void => {
  if (!userId) {
    console.warn("Cannot start Square OAuth: missing userId");
    return;
  }
  sessionStorage.setItem("square_oauth_pending", "true");
  window.location.assign(`${BASE_URL}/square/authorize?id=${userId}`);
};

// === POS: Only status & refresh ===
export const getPosToken = async (provider: "square" | "clover", merchantId?: string | null) => {
  if (!merchantId) {
    console.error("NO MERCHANT ID for:", provider);
  }
  const {data} = await api.get(`/${provider}/status`, {params: {merchant_id: merchantId}});
  return data;
};

export const refreshPosToken = async (provider: "square" | "clover", merchantId?: string | null) => {
  if (!merchantId) {
    console.error("NO MERCHANT ID for:", provider);
  }
  const {data} = await api.post(`/${provider}/refresh`, null, {params: {merchant_id: merchantId}});
  return data;
};