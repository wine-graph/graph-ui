import Button from "./common/Button.tsx";
import { type Producer } from "../types/Producer.ts";
import { mockWines } from "../types/Wine.ts";
import type { IconType } from "react-icons";

type ButtonProp = {
  icon: IconType;
  iconClass: string;
  title: string;
  className: string;
};

type ProducerCardProps = {
  producer: Producer;
  button: ButtonProp;
  actionOnProducer: (id: string) => void;
};

const ProducerCard: React.FC<ProducerCardProps> = ({
  producer,
  button,
  actionOnProducer,
}) => {
  const wines = mockWines.filter((w) => w.producer === producer.name);
  const { icon: Icon, iconClass, title, className } = button;
  return (
    <div className="flex flex-col justify-between border border-border rounded-xl p-4 bg-background/20">
      <div className="">
        <div className="header">
          <div className="title">
            <h1 className="font-semibold text-textPrimary">{producer.name}</h1>
            <p className="location text-xs text-textSecondary">
              {producer.areaId}
            </p>
          </div>
          <div className="offer-badge"></div>
        </div>
        <p className="desc my-3 text-xs text-textSecondary">
          {producer.description}
        </p>
        <div className="featured-wines text-textPrimary mt-4">
          <p className="text-sm font-semibold">Featured Wines</p>
          <ul className="divide-y divide-gray-300 text-xs">
            {wines.slice(0, 2).map((wine) => (
              <li
                key={wine.id}
                className="flex items-center justify-between px-2 py-2"
              >
                <div className="left space-y-0.5">
                  <h2 className="wine font-medium">
                    {wine.vintage} {wine.name}
                  </h2>
                  <p className="details text-xs text-textSecondary">
                    {wine.color} · {wine.shape} · {wine.closure}
                  </p>
                </div>
                <div className="right space-y-0.5">
                  <p className="quantity font-medium italic">{wine.size}ml</p>
                  <p className="price text-primary font-bold">
                    $ {wine.pricePerBottle}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="action w-full flex items-center justify-between mt-8">
        <Button
          onClick={() => actionOnProducer(producer.id)}
          className={className}
        >
          <Icon className={`text-sm ${iconClass}`} />
          <span className={`${iconClass} text-sm`}>{title}</span>
        </Button>
        <Button className="bg-primary text-white hover:bg-buttonHover px-3 py-2 md:text-base border-primary hover:border-buttonHover">
          <span className="text-sm">Request Detailes</span>
        </Button>
      </div>
    </div>
  );
};

export default ProducerCard;
