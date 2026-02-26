import type {ReactNode} from "react";

type ActionRowProps = {
  children: ReactNode;
  className?: string;
};

export const ActionRow = ({children, className = ""}: ActionRowProps) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${className}`.trim()}>
      {children}
    </div>
  );
};

export default ActionRow;
