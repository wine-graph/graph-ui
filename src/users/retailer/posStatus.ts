import type { PosToken } from "../../auth/types.ts";

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
  if (token.expiry == null) return "connected";
  return token.expiry > Date.now() ? "connected" : "expired";
}

export function isAuthorized(token?: PosToken | null): boolean {
  if (!token) return false;
  if (token.expiry == null) return true;
  return token.expiry > Date.now();
}

export function formatExpiry(expiry?: number | null): string {
  return expiry ? new Date(expiry).toLocaleString() : "—";
}
