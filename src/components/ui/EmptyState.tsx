import type {ReactNode} from "react";

type EmptyStateProps = {
  title: string;
  desc?: string;
  action?: ReactNode;
  className?: string;
};

export const EmptyState = ({title, desc, action, className = ""}: EmptyStateProps) => {
  return (
    <div className={`ui-empty-state ${className}`.trim()}>
      <p className="ui-empty-state-title">{title}</p>
      {desc ? <p className="ui-empty-state-desc">{desc}</p> : null}
      {action ? <div className="ui-empty-state-action">{action}</div> : null}
    </div>
  );
};
