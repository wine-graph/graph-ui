import SectionCard from "./SectionCard.tsx";
import React from "react";
import {LogOut, User} from "lucide-react";
import {useAuth} from "../../auth/authContext.ts";
import {useNavigate} from "react-router-dom";

type GoogleProfileProps = { name: string; picture: string; email: string };

const GoogleProfile: React.FC<GoogleProfileProps> = (profile: GoogleProfileProps) => {
  const {logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
    } finally {
      navigate("/");
    }
  };

  return (
    <SectionCard cardHeader={{icon: User, title: "Your Google Account"}}>
      <div className="flex items-center gap-4 p-4">
        {profile.picture ? (
          <img
            src={profile.picture}
            alt={profile.name ?? "User"}
            className="w-18 h-18 rounded-full object-cover border"
          />
        ) : null}
        <div className="flex flex-col">
          <span className="text-textPrimary text-lg font-medium">{profile.name ?? "Unknown User"}</span>
          <span className="text-textSecondary text-sm">{profile.email ?? "No email on file"}</span>
        </div>
      </div>

      {/* Logout button */}
      <button
        type="button"
        onClick={handleLogout}
        className="ml-auto btn-minimal tap-target flex items-center gap-2 rounded-md px-2 py-2 transition
                     hover:bg-red-50 hover:text-red-600 active:scale-[0.98]
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60
                     dark:hover:bg-red-900/20 group"
        aria-label="Log out"
        title="Log out"
      >
        <LogOut className="w-5 h-5 transition-transform duration-150 group-hover:scale-110"/>
      </button>
    </SectionCard>
  )
}

export default GoogleProfile;