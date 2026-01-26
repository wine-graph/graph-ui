import React from "react";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  theme?: "light" | "dark" | "neutral";
  shape?: "rounded" | "square";
  /**
   * Visual size variant. "md" follows Google's recommended 40px height.
   */
  size?: "sm" | "md" | "lg";
};
/**
 * Branded Google Sign-in button following Google's Identity guidelines.
 * Uses Google's official downloadable button assets placed under `src/public/google`.
 * We intentionally use PNG variants with multiple densities (1x–4x) so browsers can
 * pick the best match. This avoids issues with dynamic SVG URL resolution in Vite
 * during production builds.
 */
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
      : "h-10 text-sm px-4"; // md

  const widthClass = fullWidth ? "w-full" : "w-auto";

  // Build a src/srcSet for PNG assets using Vite's import.meta.glob so the
  // files are included in the production build (dynamic string URLs won't be processed).
  // Files live at: src/public/google/png@{1x..4x}/{theme}/web_{theme}_{rd|sq}_{VARIANT}@{1x..4x}.png
  // We'll default to the "SI" (Sign in) variant, then fall back to "ctn" and "na" if needed.
  const themeKey = theme; // "neutral" | "light" | "dark"
  const shapeKey = shape === "square" ? "sq" : "rd";
  const preferredVariants = ["SI", "ctn", "na"]; // order of preference

  // Eagerly import all PNGs as URLs
  const pngManifest = import.meta.glob(
    "../public/google/png@*/*/*.png",
    { eager: true, as: "url" }
  ) as Record<string, string>;

  // Helper to find the best matching URL among available densities for a given variant
  const findDensityUrls = (variant: string) => {
    const mk = (d: 1 | 2 | 3 | 4) =>
      `../public/google/png@${d}x/${themeKey}/web_${themeKey}_${shapeKey}_${variant}@${d}x.png`;
    const d1 = pngManifest[mk(1)];
    const d2 = pngManifest[mk(2)];
    const d3 = pngManifest[mk(3)];
    const d4 = pngManifest[mk(4)];
    return { d1, d2, d3, d4 } as const;
  };

  let src1x: string | undefined;
  let srcSet: string | undefined;
  for (const v of preferredVariants) {
    const { d1, d2, d3, d4 } = findDensityUrls(v);
    if (d1 || d2 || d3 || d4) {
      // Choose a reasonable default src and construct srcSet with whatever densities exist
      src1x = d1 ?? d2 ?? d3 ?? d4; // browser will still use srcSet if DPR > 1
      const parts: string[] = [];
      if (d1) parts.push(`${d1} 1x`);
      if (d2) parts.push(`${d2} 2x`);
      if (d3) parts.push(`${d3} 3x`);
      if (d4) parts.push(`${d4} 4x`);
      srcSet = parts.join(", ");
      break;
    }
  }

  // As an extreme fallback (shouldn't happen), keep empty which will render nothing visible

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Sign in with Google"
      className={[
        // Keep an accessible, clickable button wrapper with focus ring.
        "inline-flex items-center justify-center rounded-[4px]",
        // Provide a minimalist transparent background so we don't conflict with baked-in asset styling
        "bg-transparent",
        // Cursor/disabled handling
        "disabled:opacity-60 disabled:cursor-not-allowed",
        // Focus style matching Google blue
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A73E8]",
        sizeClasses,
        widthClass,
        className,
      ].join(" ")}
    >
      {/* The official button asset already contains the Google mark and text. */}
      <img
        src={src1x}
        srcSet={srcSet}
        alt="Sign in with Google"
        className={[
          // Make image height follow the chosen size; width scales automatically.
          size === "lg" ? "h-12" : size === "sm" ? "h-9" : "h-10",
          // Prevent the image from shrinking in flex layouts.
          "block w-auto select-none",
        ].join(" ")}
        draggable={false}
      />
    </button>
  );
};

export default GoogleSignIn;
