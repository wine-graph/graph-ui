import React from "react";

type WineData = {
  name: string;
  varietal: string;
  vintage: number;
  description?: string;
};

export const WineCard: React.FC<WineData> = (wine: WineData) => {
  return (
    <div className="border border-border rounded-xl p-3 shadow-sm">
      <div className="space-y-1">
        <h3 className="font-medium text-textPrimary truncate" title={wine.name}>
          {wine.name}
        </h3>
        <div className="text-md text-textSecondary">
          {wine.varietal} • {wine.vintage}
        </div>
      </div>
    </div>
  );
};