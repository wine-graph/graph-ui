import SectionCard from "./SectionCard.tsx";
import React from "react";
import { User } from "lucide-react";

type GoogleProfileProps = { name: string; picture: string; email: string };

const GoogleProfile: React.FC<GoogleProfileProps> = (profile: GoogleProfileProps) => {
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
    </SectionCard>
  )
}

export default GoogleProfile;