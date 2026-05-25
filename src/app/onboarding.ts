import type {GraphUser, Role} from "../auth";
import {deriveRole} from "../auth/types.ts";

export const ONBOARDING_PATH = "/onboarding";
export const supportedOnboardingRoles: Role[] = ["retailer", "producer"];

export function isSupportedOnboardingRole(role: Role | null | undefined): role is "retailer" | "producer" {
  return role === "retailer" || role === "producer";
}

export function roleProfilePath(user: GraphUser | null | undefined): string {
  const role = deriveRole(user?.role?.value);
  const id = user?.role?.id;

  if (role === "retailer" && id) return `/retailer/${id}/profile`;
  if (role === "producer") return "/profile";

  return "/profile";
}
