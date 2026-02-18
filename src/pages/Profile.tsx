import PageHeader from "../components/PageHeader.tsx";
import GoogleSignIn from "../components/GoogleSignIn.tsx";
import type {Role} from "../auth";
import {startAuthentication, useAuth} from "../auth";
import React, {useState} from "react";
import {Send} from "lucide-react";
import {useNavigate} from "react-router-dom";
import GoogleProfile from "../components/GoogleProfile.tsx";
import {FullScreenSpinner} from "../components/FullScreenSpinner.tsx";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const {isAuthenticated, user, setLocalRole, isInitializing} = useAuth();

  const role = user?.user.role?.value ?? "visitor";

  if (isInitializing) {
    return <FullScreenSpinner label="Loading your profile..." />
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:my-12">
      <PageHeader
        title={isAuthenticated ? "Welcome back!" : "Register for a Profile"}
        desc={
          isAuthenticated
            ? `Hi ${user?.user.name}, welcome back to Wine Graph.`
            : "This platform allows you to manage wine data based on your role."
        }
      />

      <div className="mt-10">
        {!isAuthenticated ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Sign-in CTA */}
            <div className="order-1">
              <GoogleSignIn
                onClick={startAuthentication}
                className="w-full sm:w-auto"
                size="lg" //default is lg
              />
            </div>

            {/* Right: Roles overview (non-interactive pre-auth) */}
            <div className="order-2">
              <RolesOverview/>
              <p className="mt-2 text-xs text-slate-500">Sign in to choose your role and unlock the relevant tools.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Google Profile */}
            <div className="order-1">
              <GoogleProfile
                name={user?.user.name ?? ""}
                email={user?.user.email ?? ""}
                picture={user?.user.picture ?? ""}
              />
            </div>

            {/* Right: Role selection (only if no role yet) + gated flows */}
            <div className="order-2 lg:order-2">
              {role === "visitor" ? (
                <RolePicker
                  currentRole={role}
                  onChange={(next) => {
                    // Local-first role selection (no backend call)
                    setLocalRole(next);
                    // Navigate immediately to placeholder route using Google user.id
                    const userId = user?.user.id;
                    if (!userId) return;
                    if (next === "producer") {
                      navigate(`/producer/${userId}/profile`, {replace: true});
                    } else if (next === "retailer") {
                      navigate(`/retailer/${userId}/profile`, {replace: true});
                    }
                  }}
                />
              ) : (
                <CurrentRoleSummary role={role}/>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Future sections can go here – plenty of horizontal space now! */}
    </div>
  );
};

const RolePicker: React.FC<{ currentRole: Role; onChange: (r: Role) => void; disabled?: boolean }> = ({
                                                                                                        currentRole,
                                                                                                        onChange,
                                                                                                        disabled = false
                                                                                                      }) => {
  const options: { value: Role; label: string; desc: string }[] = [
    {value: "retailer", label: "Retailer", desc: "Manage POS integrations and inventory."},
    {value: "producer", label: "Producer", desc: "Onboard as a producer and manage your wines."},
    {value: "enthusiast", label: "Enthusiast", desc: "Discover wines and retailers (read-only)."},
  ];

  // Keep selection local until user explicitly confirms
  const [pendingRole, setPendingRole] = useState<Role | null>(() => {
    // currentRole will be 'visitor' for first-time selection
    // initialize as null so nothing is pre-selected by code (radios control state)
    return currentRole && currentRole !== 'visitor' ? currentRole : null;
  });

  const canConfirm = !disabled && pendingRole != null && pendingRole !== 'visitor' && pendingRole !== currentRole;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (canConfirm && pendingRole) {
      console.info("[role] confirm selection", {from: currentRole, to: pendingRole});
      onChange(pendingRole);
    }
  };

  return (
    <form onSubmit={handleConfirm} className={`rounded-lg border p-4 ${disabled ? 'opacity-60' : ''}`}>
      <h3 className="text-lg font-semibold">Choose your role</h3>
      <p className="text-sm text-slate-600 mb-3">Select one, then tap Confirm to apply. This helps prevent accidental
        changes.</p>
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-start gap-3 p-2 rounded ${disabled ? 'cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'}`}
          >
            <input
              type="radio"
              name="role"
              value={opt.value}
              checked={pendingRole === opt.value}
              onChange={() => {
                if (disabled) return;
                console.debug("[role] pending selection set", {value: opt.value});
                setPendingRole(opt.value);
              }}
              disabled={disabled}
              className="mt-1"
            />
            <span>
              <div className="font-medium">{opt.label}</div>
              <div className="text-xs text-slate-600">{opt.desc}</div>
            </span>
          </label>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={!canConfirm}
          aria-disabled={!canConfirm}
          className={`ml-0 btn-minimal tap-target group flex items-center justify-center rounded-md p-2 transition active:scale-[0.98]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60
            ${canConfirm ? 'hover:bg-blue-50 text-blue-600' : 'cursor-not-allowed text-slate-400'}
          `}
          aria-label="Confirm role selection"
          title={canConfirm ? 'Confirm selection' : 'Select a role to enable confirm'}
        >
          <Send className={`w-6 h-6 transition-transform duration-150 ${canConfirm ? 'group-hover:scale-110' : ''}`}/>
          <span className="sr-only">Confirm role selection</span>
        </button>
        {!canConfirm && (
          <span className="text-xs text-slate-500">Pick a role to enable confirm.</span>
        )}
      </div>
    </form>
  );
};

const RolesOverview = () => {
  const items = [
    {title: "Retailer", desc: "Connect POS and manage inventory."},
    {title: "Producer", desc: "Onboard your winery and manage your portfolio."},
    {title: "Enthusiast", desc: "Discover wines and retailers (read-only)."},
  ];
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Platform roles</h3>
      <p className="text-sm text-slate-600 mb-3">Review roles, then pick one after you sign in.</p>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.title} className="p-2 rounded bg-slate-50">
            <div className="font-medium">{it.title}</div>
            <div className="text-xs text-slate-600">{it.desc}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CurrentRoleSummary: React.FC<{ role: Role }> = ({role}) => (
  <div className="rounded-lg border p-4">
    <h3 className="text-lg font-semibold">Current role</h3>
    <p className="text-sm text-slate-600 capitalize">{role}</p>
    <p className="text-xs text-slate-500 mt-2">
      Role selection is part of initial setup. You can continue using Wine Graph with your current role.
    </p>
  </div>
);