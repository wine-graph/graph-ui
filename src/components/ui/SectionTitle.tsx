type SectionTitleProps = {
  title: string;
  desc?: string;
  eyebrow?: string;
  className?: string;
  titleClassName?: string;
  descClassName?: string;
  as?: "h1" | "h2" | "h3";
};

export const SectionTitle = ({
  title,
  desc,
  eyebrow,
  className = "",
  titleClassName = "",
  descClassName = "",
  as = "h2",
}: SectionTitleProps) => {
  const HeadingTag = as;
  return (
    <div className={className}>
      {eyebrow ? <p className="ui-section-eyebrow">{eyebrow}</p> : null}
      <HeadingTag className={`text-title ${titleClassName}`.trim()}>{title}</HeadingTag>
      {desc ? <p className={`ui-section-desc ${descClassName}`.trim()}>{desc}</p> : null}
    </div>
  );
};
