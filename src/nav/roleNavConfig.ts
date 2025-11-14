import {FaBoxOpen, FaGlobe, FaHome, FaShoppingCart, FaUser} from "react-icons/fa";
import {FaWineBottle} from "../assets/icons.ts";
import type {IconType} from "react-icons";

export type NavLinkDef = {
  title: string;
  icon: IconType;
  route?: string;
};

// Base links common to most roles
const baseLinks: NavLinkDef[] = [
  {title: "Home", icon: FaHome, route: "/"},
  {title: "Discover", icon: FaGlobe, route: "/explore"},
  {title: "Marketplace", icon: FaShoppingCart, route: "/marketplace"},
  {title: "Profile", icon: FaUser, route: "/profile"},
];

// Role-specific augmentations
function retailerLinks(retailerId: string): NavLinkDef[] {
  const cellar: NavLinkDef = {title: "Cellar", icon: FaBoxOpen, route: `/retailer/${retailerId}/inventory`};
  const marketplace: NavLinkDef = {title: "Marketplace", icon: FaWineBottle, route: "/retailer/marketplace"};
  const profile: NavLinkDef = {title: "Profile", icon: FaUser, route: `/retailer/${retailerId}/profile`};
  return [baseLinks[0], marketplace, cellar, profile];
}

function visitorLinks(): NavLinkDef[] {
  return baseLinks;
}

function enthusiastLinks(): NavLinkDef[] {
  return baseLinks;
}

function producerLinks(): NavLinkDef[] {
  return baseLinks;
}

export function resolveNavLinksByRole(role: string, userId?: string): NavLinkDef[] {
  const normalized = (role || "visitor").toLowerCase();
  switch (normalized) {
    case "retailer":
      console.log("Resolving links for Retailer:", userId);
      return userId ? retailerLinks(userId) : baseLinks;
    case "enthusiast":
      return enthusiastLinks();
    case "producer":
      return producerLinks();
    default:
      return visitorLinks();
  }
}

// Helper to get concrete path string (resolves buildRoute if present)
export function toPath(link: NavLinkDef): string {
  return link.route ? link.route : "";
}
