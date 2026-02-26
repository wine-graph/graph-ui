import type {ReactNode} from "react";

type SocialLoginButtonProps = {
  label: string;
  logo: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const SocialLoginButton = ({
                             label,
                             logo,
                             onClick,
                             disabled = false,
                             fullWidth = false,
                             className = "",
                             size = "lg",
                           }: SocialLoginButtonProps) => {
  const sizeClasses =
    size === "sm"
      ? "min-h-10 px-4 text-sm"
      : size === "md"
        ? "min-h-11 px-4 text-sm"
        : "min-h-12 px-5 text-base";

  const widthClass = fullWidth ? "w-full" : "w-auto";
  const logoBoxSize =
    size === "sm"
      ? "h-4 w-4"
      : size === "md"
        ? "h-[18px] w-[18px]"
        : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={[
        "relative inline-flex items-center justify-center rounded-xl border bg-white text-slate-900 shadow-sm transition",
        "border-token hover:border-slate-300 hover:bg-slate-50 hover:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:border-token disabled:hover:bg-white",
        sizeClasses,
        widthClass,
        className,
      ].join(" ")}
    >
      <span
        className={[
          "pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 shrink-0 items-center justify-center",
          logoBoxSize,
        ].join(" ")}
        aria-hidden="true"
      >
        {logo}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default SocialLoginButton;
