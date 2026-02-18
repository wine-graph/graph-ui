// OverlaySpinner.tsx
import Spinner from "./Spinner";

interface OverlaySpinnerProps {
  label?: string;
  className?: string;
}

export const OverlaySpinner: React.FC<OverlaySpinnerProps> = ({
                                                                label = "Updating…",
                                                                className = "",
                                                              }) => {
  return (
    <div
      className={`absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[2px] rounded-lg ${className}`}
    >
      <div className="bg-white/90 px-6 py-4 rounded-lg shadow-lg">
        <Spinner label={label} className="gap-3"/>
      </div>
    </div>
  );
};