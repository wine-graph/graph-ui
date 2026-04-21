import PageHeader from "../components/PageHeader.tsx";
import SocialLoginButton from "../components/SocialLoginButton.tsx";
import type {Role} from "../auth";
import {startAuthentication, useAuth} from "../auth";
import React, {useState} from "react";
import {Send} from "lucide-react";
import {useNavigate} from "react-router-dom";
import GoogleProfile from "../components/GoogleProfile.tsx";
import {FullScreenSpinner} from "../components/FullScreenSpinner.tsx";
import {Card, SectionTitle} from "../components/ui";
import facebookLogo from "../public/facebook/Facebook_Logo_Primary.png";

const GoogleMark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="h-full w-full block"
    aria-hidden="true"
  >
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

const XMark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 1227"
    className="h-full w-full block text-black"
    aria-hidden="true"
    fill="none"
  >
    <path
      d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
      fill="currentColor"
    />
  </svg>
);

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
            <Card className="order-1 p-6">
              <SectionTitle
                eyebrow="Authentication"
                title="Sign in to continue"
                desc="Use a social account to connect your profile and unlock role-specific features."
                className="mb-6"
              />
              <div className="flex flex-col gap-3 sm:max-w-md">
                <SocialLoginButton
                  label="Continue with Google"
                  logo={<GoogleMark />}
                  onClick={startAuthentication}
                  fullWidth
                  size="lg"
                  className="w-full"
                />
                <SocialLoginButton
                  label="Continue with Facebook"
                  logo={<img src={facebookLogo} alt="Facebook" className="h-full w-full object-contain" draggable={false} />}
                  disabled
                  fullWidth
                  size="lg"
                  className="w-full"
                />
                <SocialLoginButton
                  label="Continue with X"
                  logo={<XMark />}
                  disabled
                  fullWidth
                  size="lg"
                  className="w-full"
                />
              </div>
              <p className="mt-3 text-xs text-fg-muted">
                More sign-in options coming soon
              </p>
            </Card>

            {/* Right: Roles overview (non-interactive pre-auth) */}
            <div className="order-2">
              <RolesOverview/>
              <p className="mt-2 text-xs text-fg-muted">Sign in to choose your role and unlock the relevant tools.</p>
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
      onChange(pendingRole);
    }
  };

  return (
    <form onSubmit={handleConfirm}>
      <Card className={`p-5 ${disabled ? 'opacity-60' : ''}`}>
        <SectionTitle
          eyebrow="Setup"
          title="Choose your role"
          desc="Select one, then confirm to apply. This helps prevent accidental changes."
          className="mb-4"
        />
        <div className="space-y-2">
          {options.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-3 rounded-[var(--radius-sm)] border border-transparent ${disabled ? 'cursor-not-allowed' : 'hover:bg-[color:var(--color-muted)] cursor-pointer'}`}
            >
              <input
                type="radio"
                name="role"
                value={opt.value}
                checked={pendingRole === opt.value}
                onChange={() => {
                  if (disabled) return;
                  setPendingRole(opt.value);
                }}
                disabled={disabled}
                className="mt-1"
              />
              <span>
                <div className="font-medium">{opt.label}</div>
                <div className="text-xs text-fg-muted">{opt.desc}</div>
              </span>
            </label>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={!canConfirm}
            aria-disabled={!canConfirm}
            className={`ml-0 btn-minimal tap-target group flex items-center justify-center rounded-md p-2 transition
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]
              ${canConfirm ? 'hover:bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]' : 'cursor-not-allowed text-fg-muted'}
            `}
            aria-label="Confirm role selection"
            title={canConfirm ? 'Confirm selection' : 'Select a role to enable confirm'}
          >
            <Send className={`w-6 h-6 transition-transform duration-150 ${canConfirm ? 'group-hover:scale-110' : ''}`}/>
            <span className="sr-only">Confirm role selection</span>
          </button>
          {!canConfirm && (
            <span className="text-xs text-fg-muted">Pick a role to enable confirm.</span>
          )}
        </div>
      </Card>
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
    <Card className="p-5">
      <SectionTitle
        eyebrow="Profiles"
        title="Platform roles"
        desc="Review roles, then pick one after you sign in."
        className="mb-4"
      />
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.title} className="p-3 rounded-[var(--radius-sm)] bg-[color:var(--color-muted)]">
            <div className="font-medium">{it.title}</div>
            <div className="text-xs text-fg-muted">{it.desc}</div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

const CurrentRoleSummary: React.FC<{ role: Role }> = ({role}) => (
  <Card className="p-5">
    <SectionTitle eyebrow="Status" title="Current role" />
    <p className="text-sm text-fg-muted capitalize mt-2">{role}</p>
    <p className="text-xs text-fg-muted mt-2">
      Role selection is part of initial setup. You can continue using Wine Graph with your current role.
    </p>
  </Card>
);
