import type { ReactNode } from "react";

import WineHome from "./WineHome";

export type userHomeComp = {
  children?: ReactNode;
  userComponent: ReactNode;
};

export const Home: React.FC<userHomeComp> = ({ children, userComponent }) => {
  return (
    <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
      {children}
      <WineHome userComponent={userComponent} />
    </div>
  );
};
