import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider,} from "react-router-dom";
import {DiscoverPage} from "./pages/Discover.tsx";
import {ProfilePage} from "./pages/Profile.tsx";
import {AuthProvider} from "./context/AuthProvider";
import {RetailerInventory} from "./users/retailer/RetailerInventory.tsx";
import RoleBasedHome from "./routes/RoleBasedHome";
import RoleRoute from "./routes/RoleRoute";
import {MarketplacePage} from "./pages/Marketplace.tsx";
import {ProducerMarketplace} from "./components/ProducerMarketplace.tsx";
import {RetailerProfile} from "./users/retailer/RetailerProfile.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={
      <AuthProvider>
        <App/>
      </AuthProvider>
    }>
      <Route index element={<RoleBasedHome/>}/>
      <Route path="explore" element={<DiscoverPage/>}/>
      <Route path="marketplace" element={<MarketplacePage/>}/>
      <Route path="profile" element={<ProfilePage/>}/>

      {/* --- Retailer section --- */}
      <Route path="retailer">
        {/* Retailer-specific routes (require :retailerId) */}
        <Route
          path=":retailerId"
          element={
            <RoleRoute allowedRoles={["retailer"]} redirectPath="/">
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
            <RoleRoute allowedRoles={["retailer"]} redirectPath="/">
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
