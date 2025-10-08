import {VisitorHomePage} from "./Visitor/VisitorHomePage.tsx";
import {RetailerHomePage} from "./Retailer/RetailerHomePage.tsx";
import React from "react";

/**
 * Home page component for all user types
 * @param userType
 */
export const HomePage: React.FC<{ userType: string }> = (userType) => {
    // believe this covers null, empty string, falsy values
    if (userType) {
        return <VisitorHomePage/>
    } else {
        return <RetailerHomePage/>
    }
}