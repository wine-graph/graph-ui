import React from "react";

type PageHeaderProps = { title: string; desc: string };

const PageHeader: React.FC<PageHeaderProps> = ({ title, desc }) => {
  return (
    <>
      <header>
        <h1 className="text-3xl font-medium text-textPrimary font-alan-sans">
          {title}
        </h1>
        <p className="text-textSecondary text-sm">{desc}</p>
      </header>
      <div className="separator" />
    </>
  );
};

export default PageHeader;
