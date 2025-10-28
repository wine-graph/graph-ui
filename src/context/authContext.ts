import {createContext} from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  pictureUrl: string;
  roles?: string[];
  retailerId?: string; // optional: associated retailer identifier for retailer users
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
