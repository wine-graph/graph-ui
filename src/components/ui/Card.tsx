import type {ReactNode} from "react";

type CardTone = "elevated" | "pop";

type CardProps = {
  children: ReactNode;
  className?: string;
  tone?: CardTone;
};

export const Card = ({children, className = "", tone = "elevated"}: CardProps) => {
  const toneClass = tone === "pop" ? "surface-pop" : "surface-elevated";
  return (
    <div className={`${toneClass} rounded-[var(--radius-lg)] ${className}`.trim()}>
      {children}
    </div>
  );
};

export default Card;
