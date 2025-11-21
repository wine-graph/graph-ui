import {Home, Globe, Store, User, Package} from "lucide-react";
import type {ElementType} from "react";

export type NavLinkDef = {
  title: string;
  icon: ElementType;
  route?: string;
};

// Base links common to most roles
const baseLinks: NavLinkDef[] = [
  {title: "Home", icon: Home, route: "/"},
  {title: "Discover", icon: Globe, route: "/explore"},
  {title: "Marketplace", icon: Store, route: "/marketplace"},
  {title: "Profile", icon: User, route: "/profile"},
];

// Role-specific augmentations
function retailerLinks(retailerId: string): NavLinkDef[] {
  // Use dynamic retailerId paths to match router: /retailer/:retailerId/...
  const cellar: NavLinkDef = {title: "Cellar", icon: Package, route: `/retailer/${retailerId}/inventory`};
  const marketplace: NavLinkDef = {title: "Marketplace", icon: Store, route: "/retailer/marketplace"};
  const profile: NavLinkDef = {title: "Profile", icon: User, route: `/retailer/${retailerId}/profile`};
  // Keep Home as the first item for consistency
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
