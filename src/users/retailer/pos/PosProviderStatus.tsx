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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm font-medium">{labels[provider]}</div>
        <div className="text-xs text-fg-muted">{statusText}</div>
        {status === "connected" && token && (
          <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-xs">
            <div className="text-fg-muted">Merchant</div>
            <div className="font-mono text-token">{token.merchantId}</div>
            <div className="text-fg-muted">Expires</div>
            <div className="font-mono text-token">{formatExpiry(token.expiresAtMs)}</div>
          </div>
        )}
      </div>
      {onRefresh && (
        <div className="flex sm:justify-end">
          <button
            type="button"
            onClick={() => onRefresh(provider)}
            disabled={globalLoading || !canRefresh}
            className="btn-minimal rounded-md p-2"
            title="Refresh status"
          >
            <RefreshCcw className={`h-5 w-5 ${globalLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      )}
    </div>
  );
}
