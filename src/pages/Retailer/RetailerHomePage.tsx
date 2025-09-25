import Hero from "../../components/home/Hero";
import { Home } from "../../components/home/Home";
import RetailerSnapshot from "../../components/users/ratailer/RetailerSnapshot";
import Wine from "../../assets/images/Wine-illustration.png";

const RetailerHomePage = () => {
  return (
    <Home userComponent={<RetailerSnapshot />}>
      <Hero
        image={Wine}
        subHeading="Bring Your Wines Closer to Customers"
        desc="Connect your shelves with the right audience — manage your collection with ease, highlight your best offers, and let customers nearby discover, trust, and choose your store as their go-to destination for the finest wines."
      />
    </Home>
  );
};

export default RetailerHomePage;
