import {StrictMode, Suspense, lazy} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import App from "./App.tsx";
import {createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider,} from "react-router-dom";
import {AuthProvider} from "./auth/AuthProvider";
import RoleRoute from "./routes/RoleRoute";
import Spinner from "./components/common/Spinner";
import {RetailerMarketplace} from "./users/retailer/RetailerMarketplace.tsx";

const DiscoverPage = lazy(() => import("./pages/Discover.tsx").then(m => ({ default: m.DiscoverPage })));
const ProfilePage = lazy(() => import("./pages/Profile.tsx").then(m => ({ default: m.ProfilePage })));
const MarketplacePage = lazy(() => import("./pages/Marketplace.tsx").then(m => ({ default: m.MarketplacePage })));
const ProducerMarketplace = lazy(() => import("./users/producer/ProducerMarketplace.tsx").then(m => ({ default: m.ProducerMarketplace })));
const RetailerInventory = lazy(() => import("./users/retailer/RetailerInventory.tsx").then(m => ({ default: m.RetailerInventory })));
const RetailerProfile = lazy(() => import("./users/retailer/RetailerProfile.tsx").then(m => ({ default: m.RetailerProfile })));
const ProducerProfile = lazy(() => import("./users/producer/ProducerProfile.tsx").then(m => ({ default: m.ProducerProfile })));
const GraphFeed = lazy(() => import("./pages/./GraphFeed.tsx"));
const ProducerInventory = lazy(() => import("./users/producer/ProducerInventory.tsx"));
const ProducerPage = lazy(() => import("./pages/ProducerPage.tsx"));
const WinePage = lazy(() => import("./pages/WinePage.tsx"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={
      <AuthProvider>
          <App/>
      </AuthProvider>
    }>
      {/* Default main page for all users: Feed (coming soon) */}
      <Route index element={(<GraphFeed/>)} />
      {/* Dashboard route for signed-in users */}
      <Route path="explore" element={(<DiscoverPage/>)} />
      {/* todo fix routes and navigate throughout */}
      <Route path="marketplace" element={(<MarketplacePage/>)} />
      {/* RetailerInventory should be 'nested' under Marketplace properly */}
      <Route path=":retailerId/inventory" element={(<RetailerInventory/>)} />
      <Route path="profile" element={(<ProfilePage/>)} />
      {/* Public graph detail routes: human-readable slugs in path; IDs used for data queries */}
      <Route path="producer/:slug/:id" element={(<ProducerPage/>)} />
      <Route path="wine/:slug/:id" element={(<WinePage/>)} />
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

      {/* --- Producer section --- */}
      <Route path="producer">
        <Route
          path=":producerId"
          element={
            <RoleRoute allowedRole={"producer"} redirectPath="/">
              <Outlet/>
            </RoleRoute>
          }
        >
          <Route path="profile" element={(<ProducerProfile/>)} />
          {/* Producer Inventory (includes CSV Import component) */}
          <Route path="inventory" element={(<ProducerInventory/>)} />
        </Route>
        <Route
          path="marketplace"
          element={
            <RoleRoute allowedRole={"producer"} redirectPath="/">
              {(<RetailerMarketplace/>)}
            </RoleRoute>
          }
        />
      </Route>
      {/* --- End Producer section --- */}

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
