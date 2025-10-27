import React, { type ReactNode } from "react";
import type { IconType } from "react-icons";

type CardHeaderProps = {
  icon: IconType;
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
    <div className="header border-b-2 border-border bg-background rounded-t-lg p-3 flex items-center gap-2">
      <Icon size={22} className="text-primary" />
      <span className="text-textPrimary font-merriweather font-medium">
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
    <div className={`w-full border-2 border-border rounded-lg ${className}`}>
      <CardHeader {...cardHeader} />
      {children}
    </div>
  );
};

export default SectionCard;
