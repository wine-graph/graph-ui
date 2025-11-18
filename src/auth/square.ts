import {useCallback} from "react";
import {useNavigate} from "react-router-dom";

/**
 * Square callback flow:
 * 1. Backend redirects to /retailer?id={merchantId}
 * 2. We call auth.loadPos("square", merchantId)
 * 3. We call auth.refreshUser() to pick up new retailer role
 * 4. We navigate to /retailer/{roleId}/profile
 */
export const useSquareOAuth = ({auth}: { auth: ReturnType<typeof import("./useAuthService.ts").useAuthService> }) => {
  const navigate = useNavigate();

  const retailerId = auth.pos.square?.merchant_id ?? "";

  const refreshPos = useCallback(async () => {
    if (!retailerId) return;
    await auth.refreshPos("square", retailerId);
  }, [auth, retailerId]);

  const authenticate = useCallback(async () => {
    const pending = sessionStorage.getItem("square_oauth_pending");
    if (!pending) return;

    const url = new URL(location.href);
    const merchantId = url.searchParams.get("id");
    const error = url.searchParams.get("error");

    console.log("Square OAuth callback:", {url, merchantId, error, pending: !!pending});

    try {
      if (error) throw new Error("Square denied access");
      if (!merchantId) throw new Error("Missing merchant ID");

      await auth.loadPos("square", merchantId);

      const updatedUser = await auth.fetchUser();

      const retailerId = updatedUser?.user.role.id ?? merchantId;

      if (retailerId) {
        navigate(`/retailer/${retailerId}/profile`, {replace: true});
      } else {
        console.warn("Square OAuth finished, but updated user has no retailer role id");
      }
    } catch (e) {
      console.error("Square OAuth failed:", e);
    } finally {
      sessionStorage.removeItem("square_oauth_pending");
      url.searchParams.delete("id");
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [auth, navigate]);

  return {authenticate, refreshPos};
};