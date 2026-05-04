import React, {useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {Send} from "lucide-react";
import PageHeader from "../components/PageHeader.tsx";
import GoogleProfile from "../components/GoogleProfile.tsx";
import {FullScreenSpinner} from "../components/FullScreenSpinner.tsx";
import {Card, Notice, SectionTitle} from "../components/ui";
import type {Role} from "../auth";
import {useAuth} from "../auth";
import {isSupportedOnboardingRole, roleProfilePath, supportedOnboardingRoles} from "../app/onboarding.ts";
import {ProducerOnboarding} from "../users/producer/ProducerOnboarding.tsx";
import PosAuthOptions from "../users/retailer/pos/PosAuthOptions.tsx";

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isInitializing,
    user,
    role,
    onboardingRole,
    selectOnboardingRole,
    clearOnboardingRole
  } = useAuth();
  const [oauthError, setOauthError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("pos_oauth_error");
    if (!stored) return;
    setOauthError(stored);
    sessionStorage.removeItem("pos_oauth_error");
  }, []);

  if (isInitializing) {
    return <FullScreenSpinner label="Loading onboarding..."/>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/profile" replace/>;
  }

  if (role) {
    return <Navigate to={roleProfilePath(user)} replace/>;
  }

  const selectedRole = isSupportedOnboardingRole(onboardingRole) ? onboardingRole : null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <PageHeader
        title="Finish setup"
        desc="Choose how you will use Wine Graph, then complete the required setup for that role."
      />

      {!selectedRole ? (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[minmax(260px,360px)_1fr] items-start gap-8">
          <GoogleProfile
            name={user?.name ?? ""}
            email={user?.email ?? ""}
            picture={user?.picture ?? ""}
          />
          <RolePicker
            currentRole={selectedRole}
            onChange={(next) => selectOnboardingRole(next)}
          />
        </div>
      ) : selectedRole === "producer" ? (
        <>
          <OnboardingStepHeader role={selectedRole} onChangeRole={clearOnboardingRole}/>
          <ProducerOnboarding
            user={user ?? undefined}
            onSuccess={(producerId) => navigate(`/producer/${producerId}/profile`, {replace: true})}
          />
        </>
      ) : (
        <>
          <OnboardingStepHeader role={selectedRole} onChangeRole={clearOnboardingRole}/>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(260px,340px)_1fr] items-start gap-8">
            <GoogleProfile
              name={user?.name ?? ""}
              email={user?.email ?? ""}
              picture={user?.picture ?? ""}
            />
            <div className="space-y-6">
              {oauthError && (
                <Notice variant="error" className="text-sm" role="alert">
                  {oauthError}
                </Notice>
              )}
              <PosAuthOptions userId={user?.id ?? ""}/>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const OnboardingStepHeader: React.FC<{ role: "retailer" | "producer"; onChangeRole: () => void }> = ({
  role,
  onChangeRole
}) => (
  <div className="mt-8 flex flex-col gap-3 border-y border-token py-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <div className="text-xs uppercase tracking-[0.16em] text-fg-muted">Selected role</div>
      <div className="mt-1 text-lg font-semibold capitalize">{role}</div>
    </div>
    <button type="button" className="btn" onClick={onChangeRole}>
      Change role
    </button>
  </div>
);

const RolePicker: React.FC<{ currentRole: Role | null; onChange: (role: Role) => void; disabled?: boolean }> = ({
  currentRole,
  onChange,
  disabled = false
}) => {
  const [pendingRole, setPendingRole] = useState<Role | null>(() => currentRole);
  const canConfirm = !disabled && pendingRole != null && pendingRole !== currentRole;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (canConfirm && pendingRole) {
      onChange(pendingRole);
    }
  };

  return (
    <form onSubmit={handleConfirm}>
      <Card className={`p-5 ${disabled ? "opacity-60" : ""}`}>
        <SectionTitle
          eyebrow="Setup"
          title="Choose your role"
          desc="Select one, then confirm to continue."
          className="mb-4"
        />
        <div className="space-y-2">
          {supportedOnboardingRoles.map((value) => {
            const option = value === "retailer"
              ? {label: "Retailer", desc: "Connect your POS and sync inventory."}
              : {label: "Producer", desc: "Create your producer profile and manage wines."};

            return (
              <label
                key={value}
                className={`flex items-start gap-3 p-3 rounded-[var(--radius-sm)] border border-transparent ${disabled ? "cursor-not-allowed opacity-60" : "hover:bg-[color:var(--color-muted)] cursor-pointer"}`}
              >
                <input
                  type="radio"
                  name="role"
                  value={value}
                  checked={pendingRole === value}
                  onChange={() => {
                    if (!disabled) setPendingRole(value);
                  }}
                  disabled={disabled}
                  className="mt-1"
                />
                <span>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-fg-muted">{option.desc}</div>
                </span>
              </label>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={!canConfirm}
            aria-disabled={!canConfirm}
            className={`ml-0 btn-minimal tap-target group flex items-center justify-center rounded-md p-2 transition
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]
              ${canConfirm ? "hover:bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]" : "cursor-not-allowed text-fg-muted"}
            `}
            aria-label="Confirm role selection"
            title={canConfirm ? "Confirm selection" : "Select a role to enable confirm"}
          >
            <Send className={`w-6 h-6 transition-transform duration-150 ${canConfirm ? "group-hover:scale-110" : ""}`}/>
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

export default OnboardingPage;

