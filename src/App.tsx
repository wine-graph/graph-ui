import Header from "./components/nav/Header";
import SideNavbar from "./components/nav/SideNavbar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { checkSession } from "./store/features/authSlice";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check user session on app mount
    dispatch(checkSession());
  }, [dispatch]);

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
