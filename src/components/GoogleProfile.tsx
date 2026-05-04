import React from "react";
import {LogOut, User} from "lucide-react";
import {useAuth} from "../auth";
import {useNavigate} from "react-router-dom";
import {Card} from "./ui";

type GoogleProfileProps = { name: string; picture: string; email: string; className?: string };

// Displays the signed-in Google account and provides a safe logout.
// Logout clears auth state via the auth machine and removes any pending POS OAuth flags.
const GoogleProfile: React.FC<GoogleProfileProps> = (profile: GoogleProfileProps) => {
  const navigate = useNavigate();
  const {logout} = useAuth();

  const handleLogout = () => {
    try {
      // Clear any pending OAuth flags so a fresh session starts clean
      try {
        sessionStorage.removeItem("square_oauth_pending");
        sessionStorage.removeItem("clover_oauth_pending");
        sessionStorage.removeItem("shopify_oauth_pending");
        sessionStorage.removeItem("wg_onboarding_role");

      } catch {
        // ignore storage errors
      }
      logout();
    } finally {
      navigate("/", {replace: true});
    }
  };

  return (
    <Card className={`p-4 ${profile.className ?? ""}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-fg-muted">
          <User className="h-4 w-4 shrink-0 text-[color:var(--color-accent)]"/>
          <span className="truncate">Signed in with Google</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="btn-minimal tap-target group flex shrink-0 items-center justify-center rounded-md p-2 transition
                     hover:bg-[color:var(--color-muted)]
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut className="h-5 w-5 transition-transform duration-150 group-hover:scale-110"/>
        </button>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        {profile.picture ? (
          <img
            src={profile.picture}
            alt={profile.name ?? "User"}
            className="h-11 w-11 shrink-0 rounded-full object-cover border border-token"
          />
        ) : (
          <div className="h-11 w-11 shrink-0 rounded-full border border-token bg-[color:var(--color-muted)]" aria-hidden="true"/>
        )}

        <div className="min-w-0">
          <div className="truncate text-textPrimary text-base font-medium">{profile.name ?? "Unknown User"}</div>
          <div className="truncate text-textSecondary text-sm">{profile.email ?? "No email on file"}</div>
        </div>
      </div>
    </Card>
  )
}

export default GoogleProfile;
