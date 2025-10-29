import Button from "./common/Button.tsx";
import React from "react";

/**
 * A reusable card for domain objects like Country, Region, Area, Varietal.
 * Pure presentational component – data fetching and iteration are handled by parent lists.
 */
export const DomainCard: React.FC<{ title: string; desc?: string; onClick?: () => void; className?: string, button: string }> = ({ title, desc, onClick, className, button }) => {
  return (
    <div className={`border border-border p-3 rounded-xl flex flex-col justify-between shadow bg-gray-50 ${className ?? ""}`}>
      <header className="mb-8">
        <h1 className="text-lg font-semibold text-textPrimary-1 mb-2">{title}</h1>
        {desc ? <p className="text-sm text-textSecondary">{desc}</p> : null}
      </header>
      <Button onClick={onClick} className="w-full flex-center bg-gray-700 text-gray-50 py-2">
        <span className="text-sm">{button}</span>
      </Button>
    </div>
  );
};