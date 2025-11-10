import {type ReactNode, useEffect, useState} from "react";
import {RetailerContext, type RetailerContextValue} from "./retailerContext.ts";
import {useAuth} from "./authContext";

export const RetailerProvider = ({children}: { children: ReactNode }) => {
  const {user} = useAuth();
  const retailer = user?.user ?? null;

  // Derive retailerId from the authenticated user's role (no localStorage persistence)
  const [retailerId, setRetailerId] = useState<string | null>(() => {
    if (retailer?.role?.value === "retailer") return retailer.role.id ?? null;
    return null;
  });

  // Keep retailerId in sync with user role
  useEffect(() => {
    if (retailer?.role?.value === "retailer") {
      setRetailerId(retailer?.role.id ?? null);
    } else {
      setRetailerId(null);
    }
  }, [retailer?.role?.value, retailer?.role?.id]);

  const value: RetailerContextValue = {retailerId, setRetailerId};

  return (
    <RetailerContext.Provider value={value}>
      {children}
    </RetailerContext.Provider>
  );
};