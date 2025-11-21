import SectionCard from "../../components/common/SectionCard.tsx";
import PageHeader from "../../components/common/PageHeader.tsx";
import {useAuth} from "../../auth/authContext.ts";
import SquareAuth from "./SquareAuth.tsx";
import {AuthDebug} from "../../auth/AuthDebug.tsx";
import {AlertCircle, CheckCircle2, RefreshCcw, Store} from "lucide-react";
import GoogleProfile from "../../components/common/GoogleProfile.tsx";

export const RetailerProfile = () => {
  const {user, isRetailer, pos, refreshPos} = useAuth();

  if (!isRetailer) {
    return <div className="p-8 text-center text-danger">Access denied. Retailer only.</div>;
  }

  const square = pos.square;
  const loading = pos.loading;
  const error = pos.error;
  const isAuthorized = !!square && new Date(square.expires_at).getTime() > Date.now();
  const notConnected = !square || !isAuthorized;
  const retailerId = user?.user.role.id ?? "";

  const handleRefresh = async () => {
    await refreshPos("square", retailerId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <PageHeader
        title="Retailer Dashboard"
        desc="Manage your profile, POS integration, and sync status."
      />

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Google Profile — now wrapped in matching SectionCard */}
        <GoogleProfile name={user?.user.name ?? ""} picture={user?.user.picture ?? ""} email={user?.user.email ?? ""}/>

        {/* Right: POS Status + Connect Card */}
        <div className="space-y-6">
          {/* POS Status Card */}
          <SectionCard cardHeader={{icon: Store, title: "POS Status"}}>
            <div className="p-6 space-y-5">
              {/* Status Badge + Message */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {loading ? (
                    <AlertCircle className="w-6 h-6 text-gray-500 animate-spin"/>
                  ) : error ? (
                    <AlertCircle className="w-6 h-6 text-danger"/>
                  ) : isAuthorized ? (
                    <CheckCircle2 className="w-6 h-6 text-success"/>
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-600"/>
                  )}

                  <div>
                    <p className="font-semibold text-lg">
                      {loading ? "Checking connection…" :
                        error ? "Connection failed" :
                          isAuthorized ? "Connected" :
                            square ? "Authorization expired" : "Not connected"}
                    </p>
                    <p className="text-sm text-fg-muted mt-1">
                      {loading ? "Verifying with Square…" :
                        error ? error :
                          isAuthorized ? "Account is synced." :
                            "Connect your Square account to enable real-time inventory sync."}
                    </p>
                  </div>
                </div>

                {isAuthorized && (
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="btn-minimal p-2 hover:bg-[color:var(--color-muted)] rounded-lg transition"
                    title="Refresh status"
                  >
                    <RefreshCcw className={`w-7 h-7 ${loading ? "animate-spin" : ""}`}/>
                  </button>
                )}
              </div>

              {/* Token details when connected */}
              {isAuthorized && square && (
                <div className="bg-[color:var(--color-muted)] rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-fg-muted">Merchant ID</span>
                    <span className="font-mono text-fg">{square.merchant_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fg-muted">Expires</span>
                    <span className="font-mono text-fg">
                      {new Date(square.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Only show Connect card if needed */}
          {notConnected && !loading && <SquareAuth/>}
        </div>
      </div>
      {import.meta.env.DEV && <AuthDebug/>}
    </div>
  );
};