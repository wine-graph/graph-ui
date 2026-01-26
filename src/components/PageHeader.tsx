import React from "react";

type PageHeaderProps = { title: string; desc?: string };

const PageHeader: React.FC<PageHeaderProps> = ({ title, desc }) => {
  return (
    <div>
      <header>
        <h1 className="text-heading-page">{title}</h1>
        {desc ? (
          <p className="text-body font-normal text-muted max-w-3xl text-compact mt-4">
            {desc}
          </p>
        ) : null}
      </header>
      <div className="w-24 h-[2px] mt-6 bg-[color:var(--color-border)]" />
    </div>
  );
};

export default PageHeader;
