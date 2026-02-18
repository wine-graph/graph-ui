import React, {useCallback, useState} from "react";
import SectionCard from "../../../components/SectionCard.tsx";
import PosConnectButton from "./PosConnectButton.tsx";
import {startAuthorization} from "../../../auth";
import squarePng from "../../../public/pos/square.png";
import cloverPng from "../../../public/pos/clover.png";
import shopifyPng from "../../../public/pos/shopify.png";
import {Store} from "lucide-react";

type Props = {
  userId: string;
};

const PosAuthOptions: React.FC<Props> = ({userId}) => {
  // Shopify shop capture state
  const [showShopifyForm, setShowShopifyForm] = useState(false);
  const [shopInput, setShopInput] = useState("");
  const [shopError, setShopError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const normalizeShopifyShop = (value: string): string => {
    const raw = value.trim();
    if (!raw) return "";
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      const url = new URL(withProtocol);
      const host = url.hostname.toLowerCase().replace(/^www\./, "");
      return host.replace(/\.myshopify\.com$/, "");
    } catch {
      return raw
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/\/.*$/, "")
        .replace(/\.myshopify\.com$/, "");
    }
  };

  const handleSquare = useCallback(() => {
    if (!userId) return;
    setIsRedirecting(true);
    startAuthorization("square", userId, null);
  }, [userId]);

  const handleClover = useCallback(() => {
    if (!userId) return;
    setIsRedirecting(true);
    startAuthorization("clover", userId, null);
  }, [userId]);

  const handleShopify = useCallback(() => {
    // Show inline form to capture shop name
    setShowShopifyForm((prev) => !prev);
  }, []);

  const submitShopify = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userId) return;
    const value = normalizeShopifyShop(shopInput);
    if (!value) {
      setShopError("Enter your Shopify shop name or URL");
      return;
    }
    setShopError(null);
    setIsRedirecting(true);
    startAuthorization("shopify", userId, value);
  }, [shopInput, userId]);

  return (
    <SectionCard
      cardHeader={{ icon: Store, title: "Point-of-sale connections" }}
    >
      <div className="p-6 space-y-4">
        <p className="text-sm text-neutral-700">
          Connect your POS to sync inventory into Wine Graph. Choose one provider to continue.
        </p>

        <div className="grid grid-cols-1 gap-3">
          <PosConnectButton logoSrc={cloverPng} label="Clover" onClick={handleClover} disabled={isRedirecting || !userId}/>
          <div>
            <PosConnectButton logoSrc={shopifyPng} label="Shopify" onClick={handleShopify} disabled={isRedirecting || !userId}/>
            {showShopifyForm && (
              <form onSubmit={submitShopify} className="mt-3 border border-neutral-200 rounded-md p-3">
                <label className="block text-sm text-neutral-900 mb-2" htmlFor="shopify-shop">
                  Shopify shop name
                </label>
                <input
                  id="shopify-shop"
                  name="shop"
                  type="text"
                  inputMode="text"
                  placeholder="e.g., my-wine-store"
                  value={shopInput}
                  onChange={(e) => {
                    setShopInput(e.target.value);
                    if (shopError) setShopError(null);
                  }}
                  className="w-full h-10 px-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                <div className="mt-2 text-xs text-neutral-700">
                  You can paste your full shop URL or just the name. We will pass it as provided and the server will normalize it.
                </div>
                {shopError && (
                  <div className="mt-2 text-xs text-red-600" role="alert">{shopError}</div>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isRedirecting}
                    className="h-10 px-4 border border-neutral-900 rounded-md bg-neutral-900 text-white focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {isRedirecting ? "Redirecting…" : "Continue to Shopify"}
                  </button>
                  <a
                    className="text-xs underline text-neutral-900"
                    href="https://help.shopify.com/en/manual/domains/myshopify-com-domains"
                    target="_blank"
                    rel="noreferrer"
                  >
                    How to find your shop name
                  </a>
                </div>
              </form>
            )}
          </div>
          <PosConnectButton logoSrc={squarePng} label="Square" onClick={handleSquare} disabled={isRedirecting || !userId}/>
        </div>
        {isRedirecting && (
          <p className="text-xs text-neutral-700" role="status">Opening provider authorization…</p>
        )}
      </div>
    </SectionCard>
  );
};

export default PosAuthOptions;
