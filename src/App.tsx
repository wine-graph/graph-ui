import Header from "./components/nav/Header";
import SideNavbar from "./components/nav/SideNavbar";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Header />
      <SideNavbar />
      <main className="w-full sm:max-w-4/5 mx-auto mb-20 sm:mb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
