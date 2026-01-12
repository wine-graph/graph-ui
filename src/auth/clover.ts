import {useCallback} from "react";
import {useNavigate} from "react-router-dom";

/**
 * Clover callback flow mirrors Square:
 * 1. Backend redirects to /retailer?id={merchantId}
 * 2. We call auth.loadPos("clover", merchantId)
 * 3. We call auth.refreshUser() to pick up new retailer role
 * 4. We navigate to /retailer/{roleId}/profile
 */
export const useCloverOAuth = ({auth}: { auth: ReturnType<typeof import("./useAuthService.ts").useAuthService> }) => {
  const navigate = useNavigate();

  const retailerId = auth.currentProvider === "clover" ? auth.user?.user.role.id : null;

  const refreshPos = useCallback(async () => {
    if (!retailerId) return;
    await auth.refreshPos("clover", retailerId);
  }, [auth, retailerId]);

  const authenticate = useCallback(async () => {
    const pending = sessionStorage.getItem("clover_oauth_pending");
    if (!pending) return;

    const url = new URL(location.href);
    const merchantId = url.searchParams.get("id");
    const error = url.searchParams.get("error");

    console.log("Clover OAuth callback:", {url, merchantId, error, pending: !!pending});

    try {
      if (error) throw new Error("Clover denied access");
      if (!merchantId) throw new Error("Missing merchant ID");

      await auth.loadPos("clover", merchantId);

      const updatedUser = await auth.fetchUser();

      const rid = updatedUser?.user.role.id ?? merchantId;

      if (rid) {
        navigate(`/retailer/${rid}/profile`, {replace: true});
      } else {
        console.warn("Clover OAuth finished, but updated user has no retailer role id");
      }
    } catch (e) {
      console.error("Clover OAuth failed:", e);
    } finally {
      sessionStorage.removeItem("clover_oauth_pending");
      url.searchParams.delete("id");
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [auth, navigate]);

  return {authenticate, refreshPos};
};
