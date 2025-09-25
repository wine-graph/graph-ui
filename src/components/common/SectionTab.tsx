import React, { type ReactNode, useState } from "react";

type SectionTabProps = {
  query: string | null;
  tabs: string[];
  tabComponents: Record<string, ReactNode>;
};

const SectionTab: React.FC<SectionTabProps> = ({
  query,
  tabs,
  tabComponents,
}) => {
  const search = query ? query : tabs[0].toLocaleLowerCase();
  const [activeLink, setActiveLink] = useState<string>(search);
  return (
    <div className="my-5">
      <div className="header bg-background pt-4 rounded-t-md">
        <ul className="flex items-center gap-x-3 text-xs sm:text-sm text-textPrimary-1 font-medium">
          {tabs.map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveLink(tab.toLocaleLowerCase())}
              className={`px-2 sm:px-4 py-1 sm:py-2 cursor-pointer transition-all duration-150
                ${
                  activeLink === tab.toLocaleLowerCase()
                    ? "bg-[#f8f1ec] rounded-t-md pb-2 sm:pb-3 -mb-1"
                    : "hover:bg-[#f8f1ec]/40 rounded-md mb-1"
                }`}
            >
              {tab}
            </li>
          ))}
        </ul>
        <div className="bg-[#f8f1ec] h-1 w-full"></div>
      </div>
      <div className="mt-4">{tabComponents[activeLink]}</div>
    </div>
  );
};

export default SectionTab;
