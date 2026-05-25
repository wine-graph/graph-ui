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
  const alignClass = align === "center" ? "ui-state-panel-center" : "ui-state-panel-left";
  const toneClass = variant === "error" ? "ui-state-panel-error" : "ui-state-panel-default";

  return (
    <div role={role} className={`ui-state-panel ${alignClass} ${toneClass} ${className}`.trim()}>
      <p className="ui-state-panel-title">{title}</p>
      {desc ? <p className="ui-state-panel-desc">{desc}</p> : null}
      {action ? <div className="ui-state-panel-action">{action}</div> : null}
    </div>
  );
};
