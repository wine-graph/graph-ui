import {
  FaClipboardList,
  FaSyncAlt,
  IoStorefrontOutline,
} from "../../assets/icons.ts";
import SectionCard from "../../components/common/SectionCard.tsx";
import Button from "../../components/common/Button.tsx";

// todo possibly remove, not sure if this is needed it was carried over from mock-ui
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
