import { Home } from "../../components/home/Home";
import Hero from "../../components/home/Hero";
import VisitorDiscover from "../../components/users/visitor/VisitorDiscover";
import visitorBg from "../../assets/images/visitor-bg.png";

const VisitorHomePage = () => {
  return (
    <Home userComponent={<VisitorDiscover />}>
      <Hero
        image={visitorBg}
        subHeading="Discover the World of Wine"
        desc="Step into a world where every bottle tells a story — from rich traditions of the past to the bold innovations of today, and even the exciting wines of tomorrow. Explore, learn, and find the perfect wine and shop near you, all in one journey."
      />
    </Home>
  );
};

export default VisitorHomePage;
