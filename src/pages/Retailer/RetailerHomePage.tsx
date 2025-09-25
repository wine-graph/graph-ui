import { Home } from "../../components/home/Home";
import RetailerSnapshot from "../../components/users/ratailer/RetailerSnapshot";

const RetailerHomePage = () => {
  return (
    <div>
      <Home userComponent={<RetailerSnapshot />} />
    </div>
  );
};

export default RetailerHomePage;
