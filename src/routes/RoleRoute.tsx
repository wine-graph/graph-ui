import type {ReactNode} from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "../context/useAuth";

interface RoleRouteProps {
  children: ReactNode;
  // If provided, users must have at least one of these roles
  allowedRoles?: string[];
  // Allow unauthenticated visitors (default true when no allowedRoles specified)
  allowVisitor?: boolean;
  // Where to redirect if access is denied
  redirectPath?: string;
}

/**
 * RoleRoute enforces access based on authentication and users roles.
 * - If allowedRoles are specified, the users must be authenticated and have any of the roles.
 * - If allowedRoles is omitted, allowVisitor governs whether unauthenticated access is permitted (default true).
 */
export const RoleRoute = ({
  children,
  allowedRoles,
  allowVisitor,
  redirectPath = "/",
}: RoleRouteProps) => {
  const {isAuthenticated, user} = useAuth();

  // If roles are required, enforce auth + role check
  if (allowedRoles && allowedRoles.length > 0) {
    if (!isAuthenticated) {
      return <Navigate to={redirectPath} replace/>;
    }
    const roles = user?.roles ?? [];
    const hasRole = roles.some(r => allowedRoles.includes(r));
    if (!hasRole) {
      return <Navigate to={redirectPath} replace/>;
    }
    return <>{children}</>;
  }

  // No roles required: decide whether to allow visitors
  const allow = allowVisitor ?? true;
  if (!allow && !isAuthenticated) {
    return <Navigate to={redirectPath} replace/>;
  }
  return <>{children}</>;
};

export default RoleRoute;
