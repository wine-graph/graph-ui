import React from "react";

type WineData = {
  name: string;
  varietal: string;
  vintage: number;
  producer?: string;
  description?: string;
};

export const WineCard: React.FC<WineData> = (wine: WineData) => {
  return (
    <div className="border border-border rounded-2xl  p-4 shadow flex flex-col justify-between">
      <div className="">
        <div className="flex justify-between mb-2">
          <h3 className="font-semibold text-textPrimary-1">{wine.name}</h3>
        </div>
        <ul className="w-fit text-xs text-textSecondary mb-2 flex gap-2">
          <li className="flex flex-col">
            <span>Varietal :</span>
            <span>Vintage :</span>
            <span>Producer :</span>
          </li>
          <li className="flex flex-col">
            <span>{wine.varietal}</span>
            <span>{wine.vintage}</span>
            <span>{wine.producer}</span>
          </li>
        </ul>
        <p className="desc text-xs text-textSecondary mt-3">
          {wine.description?.slice(0, 120) + "..."}
        </p>
      </div>
    </div>
  );
};