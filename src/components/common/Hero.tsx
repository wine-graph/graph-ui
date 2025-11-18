type HeroProps = {
  subHeading: string;
  desc: string;
};

const Hero: React.FC<HeroProps> = ({ subHeading, desc }) => {
  return (
      <section className="min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-3xl mx-auto">
          {subHeading ? (
            <div className="text-heading text-center">
              {subHeading}
            </div>
          ) : null}
          <p className="text-large text-muted mt-4 mx-auto text-compact">
            {desc}
          </p>
          {/* CTA area intentionally slimmer; when buttons are added, use py-3.5 px-8 and mt-10 */}
          </div>
        </div>
      </section>

  );
};

export default Hero;
