import type {ReactNode} from "react";

type ActionRowProps = {
  children: ReactNode;
  className?: string;
};

export const ActionRow = ({children, className = ""}: ActionRowProps) => {
  return (
    <div className={`ui-action-row ${className}`.trim()}>
      {children}
    </div>
  );
};
