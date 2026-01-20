import React from "react";

type Props = {
  logoSrc: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  /**
   * Visual size of the button and logo. Defaults to "md".
   * sm: smaller footprint; md: balanced; lg: larger, more prominent.
   */
  size?: "sm" | "md" | "lg";
  /**
   * Optional extra classes to override width or other layout details.
   */
  className?: string;
  /**
   * How the logo should fit inside the button.
   * - auto (default): uses preset logo sizes per button size.
   * - fill: scales the logo to fill the button height (object-contain), maximizing presence.
   */
  fit?: "auto" | "fill";
};

const PosConnectButton: React.FC<Props> = ({logoSrc, label, onClick, disabled, ariaLabel, size = "sm", className = "", fit = "fill"}) => {
  // Map size to container height and logo dimensions
  const containerHeight = size === "sm" ? "h-12" : size === "lg" ? "h-24" : "h-16"; // md default, lg bigger
  const logoSize = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10"; // used when fit = auto

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? `Connect ${label}`}
      className={[
        // Full-width at all breakpoints inside cards per guidance
        "group w-full inline-flex items-center justify-center",
        // Clickable area (controlled by size)
        `${containerHeight} px-4 rounded-md border border-neutral-200`,
        // Monochrome surface
        "bg-white text-neutral-900",
        // Hover/disabled behavior
        "hover:bg-neutral-50 disabled:opacity-60 disabled:cursor-not-allowed",
        // Strong focus ring for accessibility
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        // Smooth transitions
        "transition-colors",
        className,
      ].join(" ")}
    >
      {/* Image-only button per guidelines; keep accessible name via aria-label */}
      <span className="sr-only">{label}</span>
      <img
        src={logoSrc}
        alt=""
        aria-hidden="true"
        className={[
          fit === "fill" ? "h-full w-auto" : logoSize,
          // Add a bit of internal padding so the logo doesn't touch the edges
          "p-2 block",
          "object-contain select-none",
        ].join(" ")}
        draggable={false}
      />
    </button>
  );
};

export default PosConnectButton;
