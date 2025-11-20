import {StrictMode, Suspense, lazy} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import App from "./App.tsx";
import {createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider,} from "react-router-dom";
import {AuthProvider} from "./auth/AuthProvider";
import RoleBasedHome from "./routes/RoleBasedHome";
import RoleRoute from "./routes/RoleRoute";
import Spinner from "./components/common/Spinner";

const DiscoverPage = lazy(() => import("./pages/Discover.tsx").then(m => ({ default: m.DiscoverPage })));
const ProfilePage = lazy(() => import("./pages/Profile.tsx").then(m => ({ default: m.ProfilePage })));
const MarketplacePage = lazy(() => import("./pages/Marketplace.tsx").then(m => ({ default: m.MarketplacePage })));
const ProducerMarketplace = lazy(() => import("./users/producer/ProducerMarketplace.tsx").then(m => ({ default: m.ProducerMarketplace })));
const RetailerInventory = lazy(() => import("./users/retailer/RetailerInventory.tsx").then(m => ({ default: m.RetailerInventory })));
const RetailerProfile = lazy(() => import("./users/retailer/RetailerProfile.tsx").then(m => ({ default: m.RetailerProfile })));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={
      <AuthProvider>
          <App/>
      </AuthProvider>
    }>
      <Route index element={<RoleBasedHome/>}/>
      <Route path="explore" element={(<DiscoverPage/>)} />
      {/* todo fix routes and navigate throughout */}
      <Route path="marketplace" element={(<MarketplacePage/>)} />
      {/* RetailerInventory should be 'nested' under Marketplace properly */}
      <Route path=":retailerId/inventory" element={(<RetailerInventory/>)} />
      <Route path="profile" element={(<ProfilePage/>)} />
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
          <Route path="inventory" element={(<RetailerInventory/>)} />
          <Route path="profile" element={(<RetailerProfile/>)} />
        </Route>
        {/* Retailer-wide routes (not tied to ID but still protected) */}
        <Route
          path="marketplace"
          element={
            <RoleRoute allowedRole={"retailer"} redirectPath="/">
              {(<ProducerMarketplace/>)}
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
    <Suspense fallback={<Spinner label="Loading…" /> }>
      <RouterProvider router={router}/>
    </Suspense>
  </StrictMode>
);
