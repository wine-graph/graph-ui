// FullScreenSpinner.tsx
import Spinner from "./Spinner";

interface FullScreenSpinnerProps {
  label?: string;
  className?: string;
}

export const FullScreenSpinner: React.FC<FullScreenSpinnerProps> = ({
                                                                      label = "Authenticating…", className = "",
                                                                    }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm ${className}`}
    >
      <Spinner label={label} className="text-xl"/>
    </div>
  );
};/**/