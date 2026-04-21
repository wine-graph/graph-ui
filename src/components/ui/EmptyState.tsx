import type {ReactNode} from "react";

type EmptyStateProps = {
  title: string;
  desc?: string;
  action?: ReactNode;
  className?: string;
};

export const EmptyState = ({title, desc, action, className = ""}: EmptyStateProps) => {
  return (
    <div className={`text-center py-10 border border-dashed border-token rounded-[var(--radius-sm)] ${className}`.trim()}>
      <p className="text-[14px] font-medium">{title}</p>
      {desc ? <p className="text-[13px] text-fg-muted mt-1">{desc}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
