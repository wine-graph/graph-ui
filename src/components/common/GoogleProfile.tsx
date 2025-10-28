import SectionCard from "./SectionCard.tsx";
import {FaConnectdevelop} from "../../assets/icons.ts";
import type {User} from "../../context/authContext.ts";
import React from "react";

const GoogleProfile: React.FC<User> = (user: User) => {
  return (
    <SectionCard cardHeader={{icon: FaConnectdevelop, title: "Your Google Account"}}>
      <div className="flex items-center gap-4 p-4">
        {user?.pictureUrl ? (
          <img
            src={user.pictureUrl}
            alt={user.name ?? "User"}
            className="w-18 h-18 rounded-full object-cover border"
          />
        ) : null}
        <div className="flex flex-col">
          <span className="text-textPrimary text-lg font-medium">{user?.name ?? "Unknown User"}</span>
          <span className="text-textSecondary text-sm">{user?.email ?? "No email on file"}</span>
        </div>
      </div>
    </SectionCard>
  )
}

export default GoogleProfile;