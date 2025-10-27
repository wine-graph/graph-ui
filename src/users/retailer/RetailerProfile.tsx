import SectionCard from "../../components/common/SectionCard.tsx";
import {FaConnectdevelop, FaLink} from "../../assets/icons.ts";
import Button from "../../components/common/Button.tsx";
import PageHeader from "../../components/common/PageHeader.tsx";
import {useAuth} from "../../context/useAuth.ts";
import SquareAuth from "./SquareAuth.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getToken, type Token} from "../../services/tokenClient.ts";
import GoogleProfile from "../../components/common/GoogleProfile.tsx";

export const RetailerProfile = () => {
  const {isAuthenticated, user} = useAuth();

  const {retailerId} = useParams();

  // POS token state
  const [token, setToken] = useState<Token | null>(null);
  const [tokenLoading, setTokenLoading] = useState<boolean>(true);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const fetchToken = async () => {
    const t = await getToken(retailerId ?? "");
    if (t) {
      setToken(t);
    } else {
      setTokenError("Failed to fetch token");
    }
  };

  useEffect(() => {
    fetchToken().then(() => setTokenLoading(false));
  }, []);

  const isPosAuthorized = !!token && new Date(token.expires_at).getTime() > Date.now();

  return (
    <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
      <PageHeader
        title="Welcome back!"
        desc="Configure your shop settings and manage integration with Square."
      />
      {/* todo: FIX loading issue */}
      {!token ? (
        <div className="text-red-600">
          <SquareAuth/>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-4">
          <GoogleProfile name={user?.name ?? ""} id={user?.id ?? ""} email={user?.email ?? ""}
                         pictureUrl={user?.pictureUrl ?? ""}/>
          {!token && isAuthenticated && !isPosAuthorized ? (
            <SquareAuth/>
          ) : <>
            {/* POS Authorization Status */}
            <SectionCard cardHeader={{icon: FaConnectdevelop, title: "POS Authorization"}}>
              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-lg font-medium 
                      ${tokenLoading ? "bg-gray-100 text-gray-700" : tokenError
                        ? "bg-red-100 text-red-700" : isPosAuthorized
                          ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {tokenLoading ? "Checking…" : tokenError
                        ? "Error" : isPosAuthorized
                          ? "Authorized" : token
                            ? "Expired" : "Not connected"}
                    </span>
                    <span className="text-md text-textSecondary">
                      {tokenLoading ? "Checking authorization status with Square…" : tokenError
                        ? tokenError : isPosAuthorized
                          ? "Your POS is connected to Wine Graph." : token
                            ? "Your Square authorization has expired. Please reauthorize." : "Connect your POS to synchronize inventory and sales."}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="bg-primary hover:bg-buttonHover text-white font-medium px-3 py-2">
                      <FaLink/>
                      <span className="text-sm">{isPosAuthorized ? "Refresh Token" : "Connect with Square"}</span>
                    </Button>
                  </div>
                </div>

                {!tokenLoading && !tokenError && token ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-textSecondary">
                    <div>
                      <div className="text-md uppercase">Merchant ID</div>
                      <div className="text-textPrimary">{token.merchant_id}</div>
                    </div>
                    <div>
                      <div className="text-sm uppercase">Wine Graph Square Client ID</div>
                      <div className="text-textPrimary break-all">{token.client_id}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-xs uppercase">Scopes</div>
                      <div className="text-textPrimary break-words">{token.scopes?.join(", ")}</div>
                    </div>
                    <div>
                      <div className="text-md uppercase">Expires</div>
                      <div className="text-textPrimary">{new Date(token.expires_at).toLocaleString()}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            </SectionCard>
          </>}
        </div>
      )}
    </div>
  );
};
