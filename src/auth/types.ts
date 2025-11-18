export type Role = "visitor" | "retailer" | "producer" | "enthusiast" | "admin";

export type User = {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: UserRole;
};

type UserRole = {
  id: string;
  value: Role;
}

export type SessionUser = {
  user: User;
  token: string;
  permissions: string[];
};

export type PosToken = {
  client_id: string;
  merchant_id: string;
  scopes: string[];
  expires_at: string;
};

export type PosState = {
  square?: PosToken | null;
  clover?: PosToken | null;
  loading: boolean;
  error: string | null;
};

export type AuthContextValue = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: SessionUser) => void;
  logout: () => void;
  fetchUser: () => Promise<SessionUser | null>;
  role: Role;
  isVisitor: boolean;
  isRetailer: boolean;
  isProducer: boolean;
  isEnthusiast: boolean;
  isAdmin: boolean;
  hasRole: (needle: string) => boolean;
  pos: PosState;
  loadPos: (provider: "square" | "clover", merchantId: string) => Promise<void>;
  refreshPos: (provider: "square" | "clover", merchantId: string) => Promise<void>;
};