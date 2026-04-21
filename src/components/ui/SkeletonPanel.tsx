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
        <div className="space-y-3">
          <div className="h-6 w-40 rounded bg-[color:var(--color-muted)]" />
          <div className="h-4 w-56 rounded bg-[color:var(--color-muted)]" />
          <div className="h-4 w-48 rounded bg-[color:var(--color-muted)]" />
        </div>
      )}
    </Card>
  );
};

export default SkeletonPanel;
