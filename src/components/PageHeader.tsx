import React from "react";
import {SectionTitle} from "./ui";

type PageHeaderProps = { title: string; desc?: string };

const PageHeader: React.FC<PageHeaderProps> = ({ title, desc }) => {
  return (
    <div className="max-w-5xl">
      <header>
        <SectionTitle
          as="h1"
          eyebrow="Wine Graph"
          title={title}
          desc={desc}
          titleClassName="text-heading-page"
          descClassName="text-body font-normal text-muted max-w-3xl text-compact mt-4"
        />
      </header>
      <div className="mt-6 h-[3px] w-28 accent-strip rounded-full" />
    </div>
  );
};

export default PageHeader;
