import {createContext, useContext} from "react";
import type {AuthContextValue} from "./types";

export const AuthContext = createContext<AuthContextValue>(null as never);

/**
 * Custom hook to access auth context values.
 * Loads XState machine into the React context.
 */
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};