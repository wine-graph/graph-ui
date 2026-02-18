import type { PosToken } from "../../auth";

export type Provider = "clover" | "shopify" | "square";

export type ProviderStatus =
  | "connected"
  | "expired"
  | "not_connected"
  | "checking"
  | "error";

export function getProviderStatus(
  token?: PosToken | null,
  loading?: boolean,
  error?: string | null
): ProviderStatus {
  if (loading) return "checking";
  if (error) return "error";
  if (!token) return "not_connected";
  // Null expiry means non-expiring token → connected
  if (token.expiresAtMs == null) return "connected";
  return token.expiresAtMs > Date.now() ? "connected" : "expired";
}

export function formatExpiry(expiry?: number | null): string {
  return expiry ? new Date(expiry).toLocaleString() : "—";
}
