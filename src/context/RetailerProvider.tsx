import {type ReactNode, useEffect, useRef, useState} from "react";
import {RetailerContext, type RetailerContextValue} from "./retailerContext.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAuth} from "./authContext";

export const RetailerProvider = ({children}: { children: ReactNode }) => {
  const {user} = useAuth();
  const [retailerId, setRetailerId] = useState<string | null>(
    () => localStorage.getItem("retailerId") // hydrate from localStorage on the first render
  );

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const callbackRetailerId = searchParams.get("id");
  const hasHandledCallback = useRef(false);

  // Handle (data-adapter) Square OAuth callback (?id=...)
  useEffect(() => {
    if (hasHandledCallback.current) return;

    // only handle once and only if we have both pieces
    if (callbackRetailerId && user) {
      // only set retailer if none exists already
      const existingId = localStorage.getItem("retailerId");
      if (!existingId) {
        hasHandledCallback.current = true;
        console.log("Handling Square OAuth callback:", callbackRetailerId);

        // persist retailer ID
        console.log("Setting retailerId for user:", callbackRetailerId);
        localStorage.setItem("retailerId", callbackRetailerId);
        setRetailerId(callbackRetailerId);

        // clean URL + navigate to retailer profile
        navigate(`/retailer/${callbackRetailerId}/profile`, { replace: true });
      } else {
        console.log("Existing retailerId detected:", existingId);
        setRetailerId(existingId);
      }
    }
  }, [callbackRetailerId, user, navigate]);

  // Optional: handle VITE_DEV_RETAILER_ID override in dev mode
  useEffect(() => {
    if (import.meta.env.MODE === "retailer" && import.meta.env.VITE_RETAILER_ID) {
      const devRetailerId = import.meta.env.VITE_RETAILER_ID;
      localStorage.setItem("retailerId", devRetailerId);
      setRetailerId(devRetailerId);
    }
  }, []);

  const value: RetailerContextValue = {retailerId, setRetailerId};

  return (
    <RetailerContext.Provider value={value}>
      {children}
    </RetailerContext.Provider>
  );
};