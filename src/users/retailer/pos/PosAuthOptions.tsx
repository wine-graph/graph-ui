import React, {useCallback, useState} from "react";
import SectionCard from "../../../components/SectionCard.tsx";
import PosConnectButton from "./PosConnectButton.tsx";
import {startAuthorization} from "../../../auth";
import {Store} from "lucide-react";
import {InputField} from "../../../components/ui";

type Props = {
  userId: string;
};

const squarePng = "/pos/square.png";
const cloverPng = "/pos/clover.png";
const shopifyPng = "/pos/shopify.png";

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
        <p className="text-sm text-fg-muted">
          Connect your POS to sync inventory into Wine Graph. Choose one provider to continue.
        </p>

        <div className="grid grid-cols-1 gap-3">
          <PosConnectButton logoSrc={cloverPng} label="Clover" onClick={handleClover} disabled={isRedirecting || !userId}/>
          <div>
            <PosConnectButton logoSrc={shopifyPng} label="Shopify" onClick={handleShopify} disabled={isRedirecting || !userId}/>
            {showShopifyForm && (
              <form onSubmit={submitShopify} className="mt-3 border border-token rounded-[var(--radius-sm)] p-3 panel-token">
                <label className="block text-sm mb-2" htmlFor="shopify-shop">
                  Shopify shop name
                </label>
                <InputField
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
                />
                <div className="mt-2 text-xs text-fg-muted">
                  You can paste your full shop URL or just the name. We will pass it as provided and the server will normalize it.
                </div>
                {shopError && (
                  <div className="mt-2 text-xs text-[color:var(--color-danger)]" role="alert">{shopError}</div>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isRedirecting}
                    className="btn btn-primary focus-accent"
                  >
                    {isRedirecting ? "Redirecting…" : "Continue to Shopify"}
                  </button>
                  <a
                    className="text-xs underline text-token"
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
          <p className="text-xs text-fg-muted" role="status">Opening provider authorization…</p>
        )}
      </div>
    </SectionCard>
  );
};

export default PosAuthOptions;
