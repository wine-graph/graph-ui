import {FaRegHeart, FaRegEye} from "../assets/icons.ts";
import Button from "./common/Button.tsx";
import type {Wine} from "../types/Wine";
import React from "react";

export const WineCard: React.FC<Wine> = ({name, pricePerBottle, vintage, producer, subarea, description}) => {
    return (
        <div className="border border-border rounded-2xl  p-4 shadow flex flex-col justify-between">
            <div className="">
                <div className="flex justify-between mb-2">
                    <h3 className="font-semibold text-textPrimary-1">{name}</h3>
                    <p className="text-sm font-semibold text-primary-1">
                        $&nbsp;{pricePerBottle}
                    </p>
                </div>
                <ul className="w-fit text-xs text-textSecondary mb-2 flex gap-2">
                    <li className="flex flex-col">
                        <span>Vintage :</span>
                        <span>Producer :</span>
                        <span>Area :</span>
                    </li>
                    <li className="flex flex-col    ">
                        <span>{vintage}</span>
                        <span>{producer}</span>
                        <span>{subarea}</span>
                    </li>
                </ul>
                <p className="desc text-xs text-textSecondary mt-3">
                    {description?.slice(0, 120) + "..."}
                </p>
            </div>
            <div className="action w-full flex items-center justify-between mt-7">
                <Button
                    className=" border-[#c4a1a8] px-3 md:px-4 text-sm md:text-base hover:bg-[#ffede1]/50 font-medium text-textPrimary">
                    <FaRegEye className="text-textPrimary-1"/>
                    <span className="text-textPrimary-1">View</span>
                </Button>
                <Button
                    className="bg-primary text-white hover:bg-buttonHover px-3 md:px-4 text-sm md:text-base border border-primary hover:border-buttonHover font-medium">
                    <FaRegHeart/>
                    <span>Save</span>
                </Button>
            </div>
        </div>
    );
};