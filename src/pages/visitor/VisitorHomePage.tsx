import Hero from "../../components/common/Hero.tsx";
import Wine from "../../assets/images/visitor-bg.png";

export const VisitorHomePage = () => {
    return (
        <Hero
            image={Wine}
            subHeading="Discover the World of Wine"
            desc="Step into a world where every bottle tells a story — from rich traditions of the past to the bold innovations of today, and even the exciting wines of tomorrow. Explore, learn, and find the perfect wine and shop near you, all in one journey."
        />
    );
};