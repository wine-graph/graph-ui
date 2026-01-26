import {createContext, useContext} from "react";
import type {useAuthService} from "./authSystem.tsx";

export type AuthContextValue = ReturnType<typeof useAuthService>;
export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};