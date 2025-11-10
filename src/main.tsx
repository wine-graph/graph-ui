import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import App from "./App.tsx";
import {createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider,} from "react-router-dom";
import {DiscoverPage} from "./pages/Discover.tsx";
import {ProfilePage} from "./pages/Profile.tsx";
import {AuthProvider} from "./context/AuthProvider";
import {RetailerInventory} from "./users/retailer/RetailerInventory.tsx";
import RoleBasedHome from "./routes/RoleBasedHome";
import RoleRoute from "./routes/RoleRoute";
import {MarketplacePage} from "./pages/Marketplace.tsx";
import {ProducerMarketplace} from "./users/producer/ProducerMarketplace.tsx";
import {RetailerProfile} from "./users/retailer/RetailerProfile.tsx";
import {RetailerProvider} from "./context/RetailerProvider.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={
      <AuthProvider>
        <RetailerProvider>
          <App/>
        </RetailerProvider>
      </AuthProvider>
    }>
      <Route index element={<RoleBasedHome/>}/>
      <Route path="explore" element={<DiscoverPage/>}/>
      <Route path="marketplace" element={<MarketplacePage/>}/>
      <Route path="profile" element={<ProfilePage/>}/>
      <Route path=":retailerId/inventory" element={<RetailerInventory/>}/>
      <Route path="producer/marketplace" element={<ProducerMarketplace/>}/>
      {/* --- Retailer section --- */}
      <Route path="retailer">
        {/* Retailer-specific routes (require :retailerId) */}
        <Route
          path=":retailerId"
          element={
            <RoleRoute allowedRole={"retailer"} redirectPath="/">
              <Outlet/>
            </RoleRoute>
          }>
          <Route path="inventory" element={<RetailerInventory/>}/>
          <Route path="profile" element={<RetailerProfile/>}/>
        </Route>
        {/* Retailer-wide routes (not tied to ID but still protected) */}
        <Route
          path="producers"
          element={
            <RoleRoute allowedRole={"retailer"} redirectPath="/">
              <ProducerMarketplace/>
            </RoleRoute>
          }
        />
      </Route>
      {/* --- End Retailer section --- */}

      {/* */}
      {/* */}
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);
