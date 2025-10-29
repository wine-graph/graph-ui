import {createContext, useContext} from "react";

export interface RetailerContextValue {
  retailerId: string | null;
  setRetailerId: (id: string | null) => void;
}

export const RetailerContext = createContext<RetailerContextValue | undefined>(undefined);

export const useRetailer = (): RetailerContextValue => {
  const ctx = useContext(RetailerContext);
  if (!ctx) throw new Error("useRetailer must be used within a RetailerProvider");
  return ctx;
};