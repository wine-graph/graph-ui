import {
  FaClipboardList,
  FaSyncAlt,
  IoStorefrontOutline,
} from "../../../assets/icons";
import SectionCard from "../../home/SectionCard";
import Button from "../../utility/Button";

const RetailerSnapshot = () => {
  return (
    <SectionCard
      cardHeader={{ icon: IoStorefrontOutline, title: "Retailer Snapshot" }}
      className="flex-1"
    >
      <div className="px-3 flex flex-col gap-3 p-3">
        <Button className="w-full bg-primary justify-center text-white hover:bg-buttonHover ">
          <FaSyncAlt size={14} />
          <span>Sync with Square</span>
        </Button>

        <Button className=" w-full justify-center text-primary-1 border-primary hover:border-primary/10 hover:bg-primary/10 ">
          <FaClipboardList size={14} />
          <span>Review Inventory</span>
        </Button>
      </div>
    </SectionCard>
  );
};

export default RetailerSnapshot;
