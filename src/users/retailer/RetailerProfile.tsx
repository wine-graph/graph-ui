import PageHeader from "../../components/PageHeader.tsx";
import {useAuth} from "../../auth";
import GoogleProfile from "../../components/GoogleProfile.tsx";
import PosAuthOptions from "./components/PosAuthOptions.tsx";
import {Store} from "lucide-react";
import SectionCard from "../../components/SectionCard.tsx";
import PosProviderStatus from "./components/PosProviderStatus";

export const RetailerProfile = () => {
  const {user, isRetailer, pos} = useAuth();

  if (!isRetailer) {
    return <div className="p-8 text-center text-red-600">Access denied. Retailer only.</div>;
  }

  // Show connections only when not loading and we have no token at all
  const notConnected = !pos.loading && !pos.token;

  const handleRefresh = async (provider: "square" | "clover" | "shopify") => {
    const merchantId = pos.token?.merchantId ?? "";
    try {
      pos.refresh(provider, merchantId);
    } catch (e) {
      console.error("POS refresh failed", provider, e);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <PageHeader
        title="Retailer dashboard"
        desc="Manage your profile, POS integration, and sync status."
      />

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Google Profile — now wrapped in matching SectionCard */}
        <GoogleProfile name={user?.user.name ?? ""} picture={user?.user.picture ?? ""} email={user?.user.email ?? ""}/>

        {/* Right: POS status and connections */}
        <div className="space-y-6">
          {/* Show status when authorized or checking; else show connect options */}
          {(!notConnected) ? (
            <SectionCard cardHeader={{icon: Store, title: "POS status"}}>
              <div className="p-6">
                {pos.provider && (
                  <PosProviderStatus
                    provider={pos.provider}
                    token={pos.token}
                    globalLoading={pos.loading}
                    globalError={pos.error}
                    onRefresh={handleRefresh}
                  />
                )}
              </div>
            </SectionCard>
          ) : (
            <PosAuthOptions userId={user?.user.id ?? ""}/>
          )}
        </div>
      </div>
      {/*{import.meta.env.DEV && <AuthDebug/>}*/}
    </div>
  );
};