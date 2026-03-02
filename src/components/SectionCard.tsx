import React, { type ReactNode, type ElementType } from "react";
import {Card} from "./ui";

type CardHeaderProps = {
  icon: ElementType;
  title: string;
};

type SectionCardProps = {
  cardHeader: CardHeaderProps;
  className?: string;
  children: ReactNode;
};

// Header with icon and title
const CardHeader: React.FC<CardHeaderProps> = ({
  icon: Icon,
  title,
}) => {
  return (
    <div className="border-b border-token bg-panel-token rounded-t-[var(--radius-lg)] px-4 py-3 flex items-center gap-2">
      <Icon className="w-5 h-5 text-[color:var(--color-accent)]" />
      <span className="text-textPrimary text-[18px] font-semibold tracking-tight">
        {title}
      </span>
    </div>
  );
};

const SectionCard: React.FC<SectionCardProps> = ({
  cardHeader,
  className,
  children,
}) => {
  return (
    <Card className={`w-full overflow-hidden ${className ?? ""}`}>
      <CardHeader {...cardHeader} />
      {children}
    </Card>
  );
};

export default SectionCard;
