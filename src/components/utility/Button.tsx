import { type ComponentPropsWithoutRef } from "react";

type ButtonProps = {
  className?: string;
} & ComponentPropsWithoutRef<"button">;

const Button = ({ className, children, ...props }: ButtonProps) => {
  return (
    <button
      className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 cursor-pointer transition-all duration-150 outline-none font-roboto ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
