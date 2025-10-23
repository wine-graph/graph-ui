import React from "react";
import {VisitorHomePage} from "./Visitor/VisitorHomePage.tsx";
import {RetailerHomePage} from "./Retailer/RetailerHomePage.tsx";

/**
 * Home page component for all user types
 * @param type
 */
export const HomePage: React.FC<{ userType: string }> = (type) => {
  // believe this covers null, empty string, falsy values
  if (type.userType === "visitor") {
    return <VisitorHomePage />;
  } else if (type.userType === "retailer") {
    return <RetailerHomePage />;
  }
};
