import React from "react";
import Hero from "../components/common/Hero.tsx";

/**
 * Home page component for all users types
 * @param type
 */
export const HomePage: React.FC<{ userType: string }> = (type) => {
  switch ((type.userType || "visitor").toLowerCase()) {
    case "retailer":
      return <RetailerHomePage />;
    case "producer":
      return <ProducerHomePage />;
    case "enthusiast":
      return <EnthusiastHomePage />;
    case "visitor":
    default:
      return <VisitorHomePage />;
  }
};

const VisitorHomePage = () => {
  return (
    <Hero
      subHeading="Discover the World of Wine"
      desc="Step into a world where every bottle tells a story — from rich traditions of the past to the bold innovations of today, and even the exciting wines of tomorrow. Explore, learn, and find the perfect wine and shop near you, all in one journey."
    />
  );
};

const RetailerHomePage = () => {
  return (
    <Hero
      subHeading="Bring Your Wines Closer to Customers"
      desc="Connect your shelves with the right audience — manage your collection with ease, highlight your best offers, and let customers nearby discover, trust, and choose your store as their go-to destination for the finest wines."
    />
  );
};

const ProducerHomePage = () => {
  return (
    <Hero
      subHeading="Showcase Your Craft"
      desc="Set up your producer profile, present your portfolio, and connect with retailers and enthusiasts discovering your wines."
    />
  );
};

const EnthusiastHomePage = () => {
  return (
    <Hero
      subHeading="Explore, Learn, Enjoy"
      desc="Browse wineries and retailers, save favorites, and deepen your wine knowledge — read-only for now."
    />
  );
};
