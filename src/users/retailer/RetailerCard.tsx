import React from "react";
import {useNavigate} from "react-router-dom";
import Button from "../../components/common/Button.tsx";
import {
  IoArrowRedo,
  IoCardOutline,
  IoLocationOutline,
  IoMailOpenOutline,
  IoPhonePortraitOutline,
  MdOutlineInventory2
} from "../../assets/icons.ts";
import {type Retailer} from "./retailer.ts";

export const RetailerCard: React.FC<Retailer> = (retailer: Retailer) => {
  const navigate = useNavigate();

  const retailerInventory = (retailerId: string) => {
    navigate(`/${retailerId}/inventory`);
  }

  return (
    <div className="flex flex-col justify-between border border-gray-300 bg-gray-50/70 rounded-xl shadow font-poppins">
      <header
        className="flex items-center justify-between border-b p-3 pb-2 border-gray-200 bg-gray-600 text-white rounded-t-xl">
        <h1 className="text-lg font-merriweather">{retailer.name}</h1>
        {retailer.logoUrl && (
          <div className="log">
            {" "}
            <img src={retailer.logoUrl} alt=""/>
          </div>
        )}
      </header>
      <div className="details w-4/5 mt-4 flex flex-col gap-3 ml-4 text-sm">
        <div className="flex items-center gap-5">
          <IoLocationOutline className="text-textPrimary-1 text-3xl"/>
          <p className="">
            {retailer.location?.address} {retailer.location?.city}, {retailer.location?.state} {retailer.location?.zipCode}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <IoMailOpenOutline className="text-textPrimary-1 text-3xl"/>
          <a href={`mailto:${retailer.location?.contactEmail}`} target="_blank">
            <span>{retailer.location?.contactEmail}</span>
          </a>
        </div>
        <div className="flex items-center gap-5">
          <IoPhonePortraitOutline className="text-textPrimary-1 text-3xl"/>
          <span>{retailer.location?.phone}</span>
        </div>
        <div className="flex items-center gap-5">
          <IoCardOutline className="text-textPrimary-1 text-3xl"/>
          <span>{retailer.pos}</span>
        </div>
      </div>
      <div className="actions flex items-center justify-between mt-12  p-4">
        <Button onClick={() => retailerInventory(retailer.id)}
                className="border-gray-400 text-textPrimary-1 hover:bg-gray-100 px-4 py-2">
          <MdOutlineInventory2 size={22}/>
          <span className="">Inventory</span>
        </Button>
        <Button className="border-gray-600 bg-gray-600 hover:bg-gray-700 text-gray-50 px-4">
          <IoArrowRedo size={22}/>
          <a href={retailer.location?.website} target="_blank">
            <span className="">Website</span>
          </a>
        </Button>
      </div>
    </div>
  );
};
