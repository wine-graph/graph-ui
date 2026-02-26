type Props = {
  className?: string;
};

export const RetailerInventorySkeleton = ({className = ""}: Props) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 animate-pulse ${className}`} aria-hidden="true">
      <div className="border-2 border-[color:var(--color-border)] bg-panel-token p-5 mb-8">
        <div className="h-9 w-72 bg-[color:var(--color-muted)] rounded mb-3"/>
        <div className="h-5 w-44 bg-[color:var(--color-muted)] rounded mb-5"/>
        <div className="h-5 w-96 max-w-full bg-[color:var(--color-muted)] rounded"/>
      </div>

      <div>
        <div className="h-8 w-36 bg-[color:var(--color-muted)] rounded mb-3"/>
        <div className="h-5 w-28 bg-[color:var(--color-muted)] rounded mb-4"/>
        <div className="h-10 w-full bg-[color:var(--color-muted)] rounded mb-4"/>

        <div className="border-2 border-[color:var(--color-border)] bg-panel-token">
          <div className="h-11 border-b border-[color:var(--color-border)] bg-[color:var(--color-muted)]/60"/>
          <div className="h-14 border-b border-[color:var(--color-border)]"/>
          <div className="h-14 border-b border-[color:var(--color-border)]"/>
          <div className="h-14"/>
        </div>
      </div>
    </div>
  );
};

export default RetailerInventorySkeleton;
