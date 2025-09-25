import { RetailerCellar as Inventory } from "../../components/users/ratailer/RetailerCellar";
import { mockInventory } from "../../types/Retailer";

const RetailerCellarPage = () => {
  return (
    <div>
      <Inventory items={mockInventory} />
    </div>
  );
};

export default RetailerCellarPage;
