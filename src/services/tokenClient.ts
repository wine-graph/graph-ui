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
  if (merchantId) {
    console.log("Getting token for merchant:", merchantId);
    const {data} = await client.get("/status", {
      params: {merchant_id: merchantId}
    });
    return data as Token | undefined;
  }
  console.log("No merchant ID provided, skipping token request");
}

export async function refreshToken(merchantId: string | undefined): Promise<void> {
  if (merchantId) {
    const response = await client.post("/refresh", null, {
      params: {merchant_id: merchantId}
    });
    console.log("Token refreshed successfully:", response.status);
  }
  console.log("No merchant ID provided, skipping token request");
}