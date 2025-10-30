import {createContext, useContext} from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  pictureUrl: string;
  roles?: string[];
};

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface AuthContextValue extends AuthState {
  login: (user?: User, token?: string) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};