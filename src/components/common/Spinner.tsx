import { Loader2 } from "lucide-react";
import React from "react";

const Spinner: React.FC<{ label?: string; className?: string }> = ({ label = "Loading…", className = "" }) => {
  return (
    <div role="status" aria-live="polite" className={`flex items-center justify-center gap-3 ${className}`}>
      <Loader2 className="animate-spin w-6 h-6" aria-hidden="true" />
      <span className="text-body text-muted">{label}</span>
    </div>
  );
};

export default Spinner;
