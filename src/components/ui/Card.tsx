import type {ReactNode} from "react";

type CardTone = "elevated" | "pop";

type CardProps = {
  children: ReactNode;
  className?: string;
  tone?: CardTone;
};

export const Card = ({children, className = "", tone = "elevated"}: CardProps) => {
  const toneClass = tone === "pop" ? "ui-card-pop" : "ui-card-elevated";
  return (
    <div className={`ui-card ${toneClass} ${className}`.trim()}>
      {children}
    </div>
  );
};
