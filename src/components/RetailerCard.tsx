import React from "react";
import Button from "./common/Button.tsx";
import {
  IoCardOutline,
  IoLocationOutline,
  IoMailOpenOutline,
  IoInformationCircleOutline,
  IoArrowRedo,
} from "../assets/icons.ts";

import { type Retailer } from "../types/Retailer.ts";

export const RetailerCard: React.FC<Retailer> = ({
  name,
  logoUrl,
  location,
  contactEmail,
  pos,
}) => {
  return (
    <div className="border border-gray-300 bg-gray-50/70 rounded-xl shadow font-poppins">
      <header className="flex items-center justify-between border-b p-3 pb-2 border-gray-200 bg-gray-600 text-white rounded-t-xl">
        <h1 className="text-lg font-merriweather">{name}</h1>
        {logoUrl && (
          <div className="log">
            {" "}
            <img src={logoUrl} alt="" />
          </div>
        )}
      </header>
      <div className="details w-4/5 my-8 flex flex-col gap-3 ml-4 text-sm">
        <div className="flex items-center gap-5">
          <IoLocationOutline className="text-textPrimary-1 text-3xl" />
          <p className="">
            {location?.address}
            {location?.city}, {location?.state} {location?.zip}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <IoMailOpenOutline className="text-textPrimary-1 text-3xl" />
          <span>{contactEmail}</span>
        </div>
        <div className="flex items-center gap-5">
          <IoCardOutline className="text-textPrimary-1 text-3xl" />
          <span>{pos}</span>
        </div>
      </div>
      <div className="actions flex items-center justify-between mt-12 p-3">
        <Button className="border-gray-600 text-textPrimary-1 hover:bg-gray-100 px-4">
          <IoInformationCircleOutline size={22} />
          <span className="">Details</span>
        </Button>
        <Button className="border-gray-600 bg-gray-600 hover:bg-gray-700 text-gray-50 px-4">
          <IoArrowRedo size={22} />
          <span className="">Website</span>
        </Button>
      </div>
    </div>
  );
};