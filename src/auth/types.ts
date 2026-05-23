export type Role = "retailer" | "producer" | "enthusiast" | "admin" | "sommelier";

export type GraphUser = {
  id: string;
  email: string;
  name: string;
  picture: string;
  role?: UserRole | null;
};

export type UserRole = {
  id: string;
  value: Role;
  // System provider identifier provided by backend (single POS per retailer)
  system?: PosProvider | null;
  token?: string | null;
};

export type PosToken = {
  merchantId: string;
  expiresAt: string;
  expiresAtMs: number;
  expiresInSeconds: number;
};

export type PosProvider = "square" | "clover" | "shopify";

// Helper to derive backend-backed roles cleanly (used in UI + machine)
export function deriveRole(rawValue: string | null | undefined): Role | null {
  if (!rawValue) return null;
  const lower = rawValue.toLowerCase();
  if (lower.includes("admin")) return "admin";
  if (lower.includes("retailer")) return "retailer";
  if (lower.includes("producer")) return "producer";
  if (lower.includes("enthusiast")) return "enthusiast";
  if (lower.includes("sommelier")) return "sommelier";
  return null;
}

export function hasRole(user: GraphUser | null, needle: Role): boolean {
  return deriveRole(user?.role?.value) === needle;
}
