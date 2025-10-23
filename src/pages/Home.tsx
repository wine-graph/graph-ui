import React from "react";
import Hero from "../components/common/Hero.tsx";
import Visitor from "../assets/images/visitor-bg.png";
import Wine from "../assets/images/Wine-illustration.png";

/**
 * Home page component for all user types
 * @param type
 */
export const HomePage: React.FC<{ userType: string }> = (type) => {
  if (type.userType === "visitor") {
    return <VisitorHomePage />;
  } else if (type.userType === "retailer") {
    return <RetailerHomePage />;
  }
};

const VisitorHomePage = () => {
  return (
    <Hero
      image={Visitor}
      subHeading="Discover the World of Wine"
      desc="Step into a world where every bottle tells a story — from rich traditions of the past to the bold innovations of today, and even the exciting wines of tomorrow. Explore, learn, and find the perfect wine and shop near you, all in one journey."
    />
  );
};

const RetailerHomePage = () => {
  return (
    <Hero
      image={Wine}
      subHeading="Bring Your Wines Closer to Customers"
      desc="Connect your shelves with the right audience — manage your collection with ease, highlight your best offers, and let customers nearby discover, trust, and choose your store as their go-to destination for the finest wines."
    />
  );
};
