import SectionCard from "./SectionCard.tsx";
import React from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../auth/authContext.ts";
import { useNavigate } from "react-router-dom";

type GoogleProfileProps = { name: string; picture: string; email: string };

// Displays the signed-in Google account and provides a safe logout.
// Logout clears auth state via the auth machine and removes any pending POS OAuth flags.
const GoogleProfile: React.FC<GoogleProfileProps> = (profile: GoogleProfileProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    try {
      // Clear any pending OAuth flags so a fresh session starts clean
      try {
        sessionStorage.removeItem("square_oauth_pending");
        sessionStorage.removeItem("clover_oauth_pending");
        sessionStorage.removeItem("shopify_oauth_pending");
        // Clear local role override used during onboarding
        sessionStorage.removeItem("wg_local_role");
      } catch {
        // ignore storage errors
      }
      logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <SectionCard cardHeader={{icon: User, title: "Your Google Account"}}>
      <div className="p-4 space-y-4">
        {/* Top row: avatar (left) + logout (right) */}
        <div className="flex items-center justify-between gap-4">
          {profile.picture ? (
            <img
              src={profile.picture}
              alt={profile.name ?? "User"}
              className="w-[72px] h-[72px] rounded-full object-cover border"
            />
          ) : (
            <div className="w-[72px] h-[72px] rounded-full border bg-[color:var(--color-muted)]" aria-hidden="true" />
          )}

          {/* Logout button (moved up for clearer affordance) */}
          <button
            type="button"
            onClick={handleLogout}
            className="ml-auto btn-minimal tap-target flex items-center gap-2 rounded-md px-2 py-2 transition
                       hover:bg-neutral-100 active:scale-[0.98]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60
                       group"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="w-7 h-7 transition-transform duration-150 group-hover:scale-110"/>
          </button>
        </div>

        {/* Bottom: name and email to better fill space */}
        <div className="flex flex-col pt-1">
          <span className="text-textPrimary text-lg font-medium">{profile.name ?? "Unknown User"}</span>
          <span className="text-textSecondary text-sm">{profile.email ?? "No email on file"}</span>
        </div>
      </div>
    </SectionCard>
  )
}

export default GoogleProfile;