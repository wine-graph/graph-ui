import {
  Activity,
  BarChart3,
  Globe,
  MessageCircleQuestion,
  Package,
  Settings,
  Store,
  User
} from "lucide-react";
import type {ElementType} from "react";

export type NavLinkDef = {
  title: string;
  icon: ElementType;
  route?: string;
};

const genericLinks: NavLinkDef[] = [
  {title: "Activity", icon: Activity, route: "/activity"},
  {title: "Analytics", icon: BarChart3, route: "/analytics"},
  {title: "Settings", icon: Settings, route: "/"},
];

// Base links common to most roles
const baseLinks: NavLinkDef[] = [
  {title: "Home", icon: BarChart3, route: "/"},
  {title: "Discover", icon: Globe, route: "/explore"},
  {title: "Marketplace", icon: Store, route: "/marketplace"},
  {title: "Profile", icon: User, route: "/profile"},
  {title: "Help", icon: MessageCircleQuestion, route: "/"},
  ...genericLinks,
];

// Role-specific augmentations
function retailerLinks(retailerId: string): NavLinkDef[] {
  // Use dynamic retailerId paths to match router: /retailer/:retailerId/...
  const cellar: NavLinkDef = {title: "Cellar", icon: Package, route: `/retailer/${retailerId}/inventory`};
  const marketplace: NavLinkDef = {title: "Marketplace", icon: Store, route: "/retailer/marketplace"};
  //const profile: NavLinkDef = {title: "Profile", icon: User, route: `/retailer/${retailerId}/profile`};
  return [baseLinks[0], marketplace, cellar, baseLinks[4], genericLinks[2]];
}

function visitorLinks(): NavLinkDef[] {
  return baseLinks;
}

function enthusiastLinks(): NavLinkDef[] {
  return baseLinks;
}

function producerLinks(): NavLinkDef[] {
  return genericLinks;
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
  // Use safe placeholder path if none provided
  return link.route ? link.route : "#";
}
