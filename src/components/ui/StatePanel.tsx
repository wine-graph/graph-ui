import type {ReactNode} from "react";

type StateVariant = "info" | "loading" | "error" | "empty";
type StateAlign = "left" | "center";

type StatePanelProps = {
  title: string;
  desc?: string;
  action?: ReactNode;
  className?: string;
  variant?: StateVariant;
  align?: StateAlign;
  role?: "status" | "alert";
};

export const StatePanel = ({
  title,
  desc,
  action,
  className = "",
  variant = "info",
  align = "left",
  role = "status",
}: StatePanelProps) => {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";
  const toneClass =
    variant === "error"
      ? "border-[color:var(--color-danger)]/30 bg-[color:var(--color-danger)]/8 text-[color:var(--color-danger)]"
      : "border-token bg-[color:var(--color-panel)] text-token";

  return (
    <div role={role} className={`rounded-[var(--radius-sm)] border p-4 flex flex-col gap-2 ${alignClass} ${toneClass} ${className}`.trim()}>
      <p className="text-[14px] font-medium">{title}</p>
      {desc ? <p className="text-[13px] text-fg-muted">{desc}</p> : null}
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
};

export default StatePanel;
