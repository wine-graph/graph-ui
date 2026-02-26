import React, {useMemo} from "react";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  theme?: "light" | "dark" | "neutral";
  shape?: "rounded" | "square";
  size?: "sm" | "md" | "lg";
};

const GoogleSignIn: React.FC<Props> = ({
  onClick,
  disabled,
  fullWidth,
  className = "",
  size = "lg",
  theme = "dark",
  shape = "rounded",
}) => {
  const sizeClasses =
    size === "sm"
      ? "h-9 text-sm px-3"
      : size === "lg"
      ? "h-12 text-base px-5"
      : "h-10 text-sm px-4";

  const imageHeightClass = size === "lg" ? "h-12" : size === "sm" ? "h-9" : "h-10";
  const widthClass = fullWidth ? "w-full" : "w-auto";

  const asset = useMemo(() => {
    const themeKey = theme;
    const shapeKey = shape === "square" ? "sq" : "rd";
    const variant = "SI";

    const at = (dpr: 1 | 2 | 3 | 4) =>
      `/google/png@${dpr}x/${themeKey}/web_${themeKey}_${shapeKey}_${variant}@${dpr}x.png`;

    return {
      src: at(1),
      srcSet: `${at(1)} 1x, ${at(2)} 2x, ${at(3)} 3x, ${at(4)} 4x`,
    };
  }, [theme, shape]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Sign in with Google"
      className={[
        "inline-flex items-center justify-center rounded-[4px]",
        "bg-transparent",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A73E8]",
        sizeClasses,
        widthClass,
        className,
      ].join(" ")}
    >
      <img
        src={asset.src}
        srcSet={asset.srcSet}
        alt="Sign in with Google"
        className={[imageHeightClass, "block w-auto select-none"].join(" ")}
        draggable={false}
      />
    </button>
  );
};

export default GoogleSignIn;
