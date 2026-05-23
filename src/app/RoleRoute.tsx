import type {ReactNode} from "react";
import {Navigate} from "react-router-dom";
import {type Role, useAuth} from "../auth";
import {FullScreenSpinner} from "../components/FullScreenSpinner.tsx";

interface RoleRouteProps {
  children: ReactNode;
  allowedRole?: Role;
  allowPublic?: boolean;
  // Where to redirect if access is denied
  redirectPath?: string;
}

/**
 * RoleRoute enforces access using backend-backed roles.
 */
export const RoleRoute = ({
  children,
  allowedRole,
  allowPublic,
  redirectPath = "/",
}: RoleRouteProps) => {
  const {isAuthenticated, role, isInitializing} = useAuth();

  if (allowedRole) {
    if (isInitializing) {
      return <FullScreenSpinner/>;
    }
    if (!isAuthenticated) {
      return <Navigate to={redirectPath} replace/>;
    }
    if (role !== allowedRole) {
      return <Navigate to={redirectPath} replace/>;
    }
    return <>{children}</>;
  }

  const allow = allowPublic ?? true;
  if (!allow && !isAuthenticated) {
    return <Navigate to={redirectPath} replace/>;
  }
  return <>{children}</>;
};

export default RoleRoute;
