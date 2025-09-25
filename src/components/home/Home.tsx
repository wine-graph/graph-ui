import type { ReactNode } from "react";

import Hero from "./Hero";
import WineHome from "./WineHome";

export type userHomeComp = {
  userComponent: ReactNode;
};

export const Home: React.FC<userHomeComp> = ({ userComponent }) => {
  return (
    <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
      <Hero />
      <WineHome userComponent={userComponent} />
    </div>
  );
};
