import { RefreshCcw } from "lucide-react";
import type { PosToken } from "../../../auth";
import { getProviderStatus, formatExpiry, type Provider } from "./posStatus.ts";

type Props = {
  provider: Provider;
  token?: PosToken | null;
  globalLoading?: boolean;
  globalError?: string | null;
  onRefresh?: (provider: Provider) => void;
};

const labels: Record<Provider, string> = {
  clover: "Clover",
  shopify: "Shopify",
  square: "Square",
};

export default function PosProviderStatus({ provider, token, globalLoading, globalError, onRefresh }: Props) {
  const status = getProviderStatus(token ?? null, globalLoading, globalError);

  const statusText =
    status === "checking" ? "Checking connection…" :
    status === "error" ? (globalError || "Connection failed") :
    status === "connected" ? "Connected" :
    status === "expired" ? "Authorization expired" :
    "Not connected";

  const canRefresh = status === "connected" || status === "expired";

  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-token last:border-b-0">
      <div className="flex items-start gap-3">
        <div>
          <div className="text-sm font-medium">{labels[provider]}</div>
          <div className="text-xs text-fg-muted">{statusText}</div>
          {status === "connected" && token && (
            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
              <div className="text-fg-muted">Merchant</div>
              <div className="font-mono text-token">{token.merchantId}</div>
              <div className="text-fg-muted">Expires</div>
              <div className="font-mono text-token">{formatExpiry(token.expiresAtMs)}</div>
            </div>
          )}
        </div>
      </div>
      {onRefresh && (
        <button
          type="button"
          onClick={() => onRefresh(provider)}
          disabled={globalLoading || !canRefresh}
          className="btn-minimal p-2 rounded-md"
          title="Refresh status"
        >
          <RefreshCcw className={`w-5 h-5 ${globalLoading ? "animate-spin" : ""}`} />
        </button>
      )}
    </div>
  );
}
