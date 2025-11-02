import axios from "axios";
import type {SessionUser} from "../context/authContext.ts";

const BASE_URL = import.meta.env.DEV
  ? "http://localhost:8082"
  : "https://graph-auth.fly.dev";

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: {Accept: "application/json"}
});


/*
  Google AuthN
 */
// called from AuthProvider after redirect
export async function completeAuth(state: string): Promise<SessionUser> {
  const {data} = await client.get(`${BASE_URL}/session/complete?state=${state}`, {
    headers: {Accept: "application/json"},
  });
  return data;
}

//
export async function getCurrentUser(token: string): Promise<SessionUser> {
  const {data} = await client.get(`${BASE_URL}/session/user`, {
    headers: {Authorization: `Bearer ${token}`}
  });
  return data;
}

// manual OIDC start
export function startAuthentication(): void {
  window.location.assign(`${BASE_URL}/session/authenticate`);
}


/*
  Square AuthZ
 */
export type Token = {
  client_id: string;
  merchant_id: string;
  scopes: string[];
  expires_at: string;
};

export async function getToken(merchantId: string | undefined): Promise<Token | undefined> {
  if (merchantId) {
    console.log("Getting token for merchant:", merchantId);
    const {data} = await client.get("/square/status", {
      params: {merchant_id: merchantId}
    });
    return data as Token | undefined;
  }
  console.log("No merchant ID provided, skipping token request");
}

// Return the updated token so callers can avoid an extra fetch
export async function refreshToken(merchantId: string | undefined): Promise<Token | undefined> {
  if (merchantId) {
    const {data, status} = await client.post("/square/refresh", {
      params: {merchant_id: merchantId}
    });
    console.log("Token refreshed successfully:", status);
    return data as Token | undefined;
  }
  console.log("No merchant ID provided, skipping token request");
}