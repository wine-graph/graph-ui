// BusyWrapper.tsx
import Spinner from "./Spinner.tsx";

interface BusyWrapperProps {
  isBusy: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  label?: string;
}

export function BusyWrapper({
                              isBusy,
                              children,
                              fallback,
                              label = "Loading…",
                            }: BusyWrapperProps) {
  if (!isBusy) return <>{children}</>;

  return fallback ?? (
    <div className="flex min-h-[200px] items-center justify-center">
      <Spinner label={label}/>
    </div>
  );
}