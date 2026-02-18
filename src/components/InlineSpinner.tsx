// InlineSpinner.tsx
import Spinner from "./Spinner";

interface InlineSpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const InlineSpinner: React.FC<InlineSpinnerProps> = ({
                                                              label = "Loading…",
                                                              size = "md",
                                                              className = "",
                                                            }) => {
  const sizes = {
    sm: "w-5 h-5 text-base",
    md: "w-6 h-6 text-body",
    lg: "w-8 h-8 text-lg",
  };

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <Spinner
        label={label}
        className={`${sizes[size]} gap-2`}
      />
    </div>
  );
};