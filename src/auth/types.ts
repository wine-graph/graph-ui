export type Role = "visitor" | "retailer" | "producer" | "enthusiast" | "admin";

export type User = {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: UserRole;
};

export type UserRole = {
  id: string;
  value: Role;
  // System provider identifier provided by backend (single POS per retailer)
  system?: PosProvider;
};

export type SessionUser = {
  user: User;
  token: string;
};

export type PosToken = {
  merchantId: string;
  expiry: number | null;
  token?: string;
};

export type PosProvider = "square" | "clover" | "shopify";

// Helper to derive role cleanly (used in UI + machine)
export function deriveRole(rawValue: string | undefined): Role {
  if (!rawValue) return "visitor";
  const lower = rawValue.toLowerCase();
  if (lower.includes("admin")) return "admin";
  if (lower.includes("retailer")) return "retailer";
  if (lower.includes("producer")) return "producer";
  if (lower.includes("enthusiast")) return "enthusiast";
  return "visitor";
}

export function hasRole(user: SessionUser | null, needle: Role): boolean {
  return deriveRole(user?.user.role.value) === needle;
}