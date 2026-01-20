import { createContext, useContext } from "react";
import { useAuthService } from "./useAuthService";

// Infer the exact return type from useAuthService — no duplication!
export type AuthContextValue = ReturnType<typeof useAuthService>;

export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Custom hook to access auth context values.
 */
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};