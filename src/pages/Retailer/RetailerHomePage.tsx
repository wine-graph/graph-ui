import Hero from "../../components/common/Hero.tsx";
import Wine from "../../assets/images/Wine-illustration.png";

export const RetailerHomePage = () => {
    return (
        <Hero
            image={Wine}
            subHeading="Bring Your Wines Closer to Customers"
            desc="Connect your shelves with the right audience — manage your collection with ease, highlight your best offers, and let customers nearby discover, trust, and choose your store as their go-to destination for the finest wines."
        />
    );
};