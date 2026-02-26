import type {ReactNode} from "react";

type NoticeVariant = "success" | "error";

type NoticeProps = {
  children: ReactNode;
  variant: NoticeVariant;
  className?: string;
  role?: "status" | "alert";
};

export const Notice = ({children, variant, className = "", role = "status"}: NoticeProps) => {
  const variantClass = variant === "success" ? "notice-success" : "notice-error";
  return (
    <div role={role} className={`${variantClass} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default Notice;
