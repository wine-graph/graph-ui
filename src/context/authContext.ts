import {createContext, useContext} from "react";

export type SessionUser = {
  user: User;
  token: string | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: Role | null;
};

export type Role = {
  value: string;
  id: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: SessionUser | null;
}

export interface AuthContextValue extends AuthState {
  login: (user?: SessionUser, token?: string) => void;
  refreshUser: () => Promise<SessionUser | null>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};