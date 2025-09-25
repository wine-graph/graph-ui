import Wine from "../../assets/images/Wine-illustration.png";

const Hero = () => {
  return (
    <div className="flex-center flex-col">
      <div className="w-52 md:w-72 my-2">
        <img src={Wine} alt="Wine Graph World" />
      </div>
      <h1 className="text-4xl md:text-6xl font-merriweather font-bold text-primary-1 mb-2 text-center">
        Wine Graph World
      </h1>
      <p className="text-gray-700 text-sm text-center px-5">
        Unified snapshot across the platform — surfacing most reviewed and
        tasted wines, trending retailer offers, and new producers.
      </p>
    </div>
  );
};

export default Hero;
