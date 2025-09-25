import { SiWine } from "../../assets/icons";

type HeroProps = {
  image: string;
  subHeading: string;
  desc: string;
};

const Hero: React.FC<HeroProps> = ({ image, subHeading, desc }) => {
  return (
    <div className="flex-center flex-col">
      <div className="w-52 md:w-72 my-2">
        <img src={image} alt="Wine Graph World" />
      </div>
      <h1 className="text-6xl font-semibold text-primary-1 flex-center flex-col gap-2 text-center font-alan-sans">
        <p className="text-base font-normal flex-center gap-2 ">
          <SiWine size={22} className="rotate-y-180" />
          {subHeading}
          <SiWine size={22} />
        </p>
        <p className="flex-center flex-col gap-2">
          <span>Welcome to</span>
          <span>Wine Graph World</span>
        </p>
      </h1>
      <p className="text-textPrimary-1 text-center px-5 my-2 font-alan-sans">
        {desc}
      </p>
    </div>
  );
};

export default Hero;
