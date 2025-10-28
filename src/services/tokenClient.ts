import axios from "axios";

export type Token = {
  client_id: string;
  merchant_id: string;
  scopes: string[];
  expires_at: string;
};

const BASE_URL = import.meta.env.DEV
  ? "http://localhost:8085/square"
  : "https://data-adapter.fly.dev/square";

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: false
});

export async function getToken(merchantId: string | undefined): Promise<Token | undefined> {
  const {data} = await client.get("/status", {
    params: merchantId ? {merchant_id: merchantId} : undefined,
  });
  return data as Token | undefined;
}

export async function refreshToken(merchantId: string | undefined): Promise<void> {
  await client.post("/refresh", {
    params: merchantId ? {merchant_id: merchantId} : undefined,
  });
}