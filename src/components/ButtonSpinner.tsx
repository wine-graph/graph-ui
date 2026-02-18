// ButtonSpinner.tsx  (for inside buttons or very small areas)
import {Loader2} from "lucide-react";

interface ButtonSpinnerProps {
  label?: string;
  className?: string;
}

export const ButtonSpinner: React.FC<ButtonSpinnerProps> = ({
                                                              label = "",
                                                              className = "",
                                                            }) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Loader2 className="animate-spin w-4 h-4"/>
      {label && <span>{label}</span>}
    </div>
  );
};