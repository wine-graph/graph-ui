import {SkeletonPanel} from "../../../components/ui";

type Props = {
  className?: string;
};

export const RetailerInventorySkeleton = ({className = ""}: Props) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 ${className}`} aria-hidden="true">
      <SkeletonPanel className="mb-8 p-6">
        <div className="space-y-3">
          <div className="h-9 w-72 bg-[color:var(--color-muted)] rounded" />
          <div className="h-5 w-44 bg-[color:var(--color-muted)] rounded" />
          <div className="h-5 w-96 max-w-full bg-[color:var(--color-muted)] rounded" />
        </div>
      </SkeletonPanel>

      <SkeletonPanel className="p-6">
        <div className="h-8 w-36 bg-[color:var(--color-muted)] rounded mb-3"/>
        <div className="h-5 w-28 bg-[color:var(--color-muted)] rounded mb-4"/>
        <div className="h-10 w-full bg-[color:var(--color-muted)] rounded mb-4"/>

        <div className="border border-token rounded-[var(--radius-sm)]">
          <div className="h-11 border-b border-token bg-[color:var(--color-muted)]/60"/>
          <div className="h-14 border-b border-token"/>
          <div className="h-14 border-b border-token"/>
          <div className="h-14"/>
        </div>
      </SkeletonPanel>
    </div>
  );
};

export default RetailerInventorySkeleton;
