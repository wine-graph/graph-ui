import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider,} from "react-router-dom";
import {DiscoverPage} from "./pages/Discover.tsx";
import {HomePage} from "./pages/Home.tsx";
import {ProfilePage} from "./pages/Profile.tsx";
import {MarketplacePage} from "./pages/Marketplace.tsx";
import {Provider} from "react-redux";
import store from "./store/store.ts";
import {InventoryPage} from "./pages/Retailer/InventoryPage.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App/>}>
      <Route index element={<HomePage userType={"retailer"}/>}/>
      <Route path="explore" element={<DiscoverPage/>}/>
      <Route path="marketplace" element={<MarketplacePage/>}/>
      <Route path="profile" element={<ProfilePage/>}/>
      <Route path="/:retailerId/inventory" element={<InventoryPage/>}/>
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>
);
