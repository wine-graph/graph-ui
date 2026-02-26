import {lazy, StrictMode, Suspense} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import App from "./App.tsx";
import {createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider,} from "react-router-dom";
import {AuthProvider} from "../auth";
import RoleRoute from "./RoleRoute.tsx";
import Spinner from "../components/Spinner.tsx";
import {likelyPathsForRole, prefetchPaths, routeLoaders} from "./routePrefetch.ts";

const DiscoverPage = lazy(routeLoaders.discover);
const ProfilePage = lazy(routeLoaders.profile);
const MarketplacePage = lazy(routeLoaders.marketplace);
const ProducerMarketplace = lazy(routeLoaders.producerMarketplace);
const RetailerInventory = lazy(routeLoaders.retailerInventory);
const RetailerProfile = lazy(routeLoaders.retailerProfile);
const ProducerProfile = lazy(routeLoaders.producerProfile);
const GraphFeed = lazy(routeLoaders.graphFeed);
const ProducerInventory = lazy(routeLoaders.producerInventory);
const ProducerPage = lazy(routeLoaders.producerPage);
const WinePage = lazy(routeLoaders.winePage);
const RetailerMarketplace = lazy(routeLoaders.retailerMarketplace);

const RetailerCellar = lazy(routeLoaders.retailerCellar);

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
      <Route path="retailer/:retailerId/inventory" element={(<RetailerInventory/>)} />
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
          <Route path="cellar" element={(<RetailerCellar/>)} />
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
          <Route path="cellar" element={(<ProducerInventory/>)} />
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

if (typeof window !== "undefined") {
  const warm = () => prefetchPaths(likelyPathsForRole({role: "visitor"}).slice(0, 3));
  const ric = window.requestIdleCallback;
  if (ric) {
    ric(warm, {timeout: 1500});
  } else {
    window.setTimeout(warm, 350);
  }
}
