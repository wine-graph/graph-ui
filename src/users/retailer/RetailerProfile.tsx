import SectionCard from "../../components/common/SectionCard.tsx";
import {FaCircleCheck, FaConnectdevelop} from "../../assets/icons.ts";
import Button from "../../components/common/Button.tsx";
import PageHeader from "../../components/common/PageHeader.tsx";
import {useAuth} from "../../auth/authContext.ts";
import GoogleProfile from "../../components/common/GoogleProfile.tsx";
import SquareAuth from "./SquareAuth.tsx";
import {AuthDebug} from "../../auth/AuthDebug.tsx";

export const RetailerProfile = () => {
  const {user, isRetailer, pos, refreshPos} = useAuth();

  if (!isRetailer) {
    return <div className="p-4 text-red-600">Access denied. Retailer only.</div>;
  }

  const square = pos.square;
  const loading = pos.loading;
  const error = pos.error;

  const isAuthorized = !!square && new Date(square.expires_at).getTime() > Date.now();
  const notConnected = !square || !isAuthorized;

  const retailerId = user?.user.role.id ?? "";

  // validate our user and token align
  if (!notConnected) {
    const merchantId = pos.square?.merchant_id ?? "";

    console.log("Retailer ID:", retailerId);
    console.log("Merchant ID:", pos);
    if (retailerId !== merchantId) {
      return <div className="p-4 text-red-600">Access denied. Retailer ID mismatch.</div>;
    }
  }

  const handleRefresh = async () => {
    await refreshPos("square", retailerId ?? "");
  };

  return (
    <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
      <PageHeader
        title="Welcome back!"
        desc="Configure your shop settings and manage integration with Square."
      />

      <div className="mt-5 flex flex-col gap-6">
        {/* Google Profile */}
        <GoogleProfile
          name={user?.user.name ?? ""}
          email={user?.user.email ?? ""}
          picture={user?.user.picture ?? ""}
        />

        {/* POS Authorization Status */}
        <SectionCard cardHeader={{icon: FaConnectdevelop, title: "POS Authorization"}}>
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-lg font-medium 
                    ${loading ? "bg-gray-100 text-gray-700" : error
                    ? "bg-red-100 text-red-700" : isAuthorized
                      ? "bg-green-100 text-green-800" : square
                        ? "bg-yellow-100 text-yellow-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {loading ? "Checking…" : error
                    ? "Error" : isAuthorized
                      ? "Authorized" : square
                        ? "Expired" : "Not connected"}
                </span>

                <span className="text-md text-textSecondary">
                  {loading ? "Checking authorization status with Square…" : error
                    ? error : isAuthorized
                      ? "Your POS is connected to Wine Graph." : square
                        ? "Your Square authorization has expired. Please reauthorize." : "Connect your POS to synchronize inventory and sales."}
                </span>
              </div>

              {isAuthorized && (
                <Button onClick={handleRefresh} disabled={loading} aria-busy={loading}
                        className="bg-primary hover:bg-buttonHover text-white font-medium px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <FaCircleCheck size={16} className="mr-2"/>
                  <span className="text-sm">Refresh Token</span>
                </Button>
              )}
            </div>

            {/* Token Details */}
            {!loading && !error && square && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-textSecondary">
                <div>
                  <div className="text-md uppercase">Merchant ID</div>
                  <div className="text-textPrimary font-mono">{square.merchant_id}</div>
                </div>
                <div>
                  <div className="text-md uppercase">Expires</div>
                  <div className="text-textPrimary">
                    {new Date(square.expires_at).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Show Connect Card if not authorized */}
        {!loading && (notConnected) && <SquareAuth/>}
        {import.meta.env.DEV ? <AuthDebug/> : null}
      </div>
    </div>
  );
};