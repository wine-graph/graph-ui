import type {ReactNode} from "react";
import {Card} from "./Card.tsx";

type SkeletonPanelProps = {
  className?: string;
  children?: ReactNode;
};

export const SkeletonPanel = ({className = "", children}: SkeletonPanelProps) => {
  return (
    <Card className={`animate-pulse p-4 ${className}`.trim()}>
      {children ?? (
        <div className="ui-skeleton-lines">
          <div className="ui-skeleton-line ui-skeleton-line-lg" />
          <div className="ui-skeleton-line ui-skeleton-line-md" />
          <div className="ui-skeleton-line ui-skeleton-line-sm" />
        </div>
      )}
    </Card>
  );
};
