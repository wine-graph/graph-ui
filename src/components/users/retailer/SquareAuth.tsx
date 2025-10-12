import SectionCard from "../../common/SectionCard";
import { FaConnectdevelop } from "../../../assets/icons";
import Button from "../../common/Button";
const SquareAuth = () => {
  return (
    <SectionCard
      cardHeader={{ icon: FaConnectdevelop, title: "Connect to Square" }}
    >
      <div className="my-3 px-4">
        <p className="text-sm text-textSecondary mb-3">
          Connect your Square account to sync inventory and sales!
        </p>
        <Button className="bg-textPrimary-1 hover:bg-gray-600 text-white font-medium px-4 py-2 my-5">
          <span className="text-sm">Connect with Square</span>
        </Button>
      </div>
    </SectionCard>
  );
};

export default SquareAuth;
