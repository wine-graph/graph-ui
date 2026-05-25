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
const OnboardingPage = lazy(routeLoaders.onboarding);
const MarketplacePage = lazy(routeLoaders.marketplace);
const ProducerMarketplace = lazy(routeLoaders.producerMarketplace);
const ProducerRetailerMarketplace = lazy(routeLoaders.producerRetailerMarketplace);
const RetailerInventory = lazy(routeLoaders.retailerInventory);
const RetailerProfile = lazy(routeLoaders.retailerProfile);
const ProducerProfile = lazy(routeLoaders.producerProfile);
const GraphFeed = lazy(routeLoaders.graphFeed);
const ProducerInventory = lazy(routeLoaders.producerInventory);
const ProducerPage = lazy(routeLoaders.producerPage);
const WinePage = lazy(routeLoaders.winePage);

const RetailerCellar = lazy(routeLoaders.retailerCellar);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={
      <AuthProvider>
          <App/>
      </AuthProvider>
    }>
      <Route index element={(<GraphFeed/>)} />
      <Route path="explore" element={(<DiscoverPage/>)} />
      <Route path="marketplace" element={(<MarketplacePage/>)} />
      <Route path="retailer/:retailerId/inventory" element={(<RetailerInventory/>)} />
      <Route path="profile" element={(<ProfilePage/>)} />
      <Route path="onboarding" element={(<OnboardingPage/>)} />
      <Route path="producer/:slug" element={(<ProducerPage/>)} />
      <Route path="producer/profile" element={
        <RoleRoute allowedRole={"producer"} redirectPath="/">
          {(<ProducerProfile/>)}
        </RoleRoute>
      } />
      <Route path="producer/cellar" element={
        <RoleRoute allowedRole={"producer"} redirectPath="/">
          {(<ProducerInventory/>)}
        </RoleRoute>
      } />
      <Route path="wine/:slug" element={(<WinePage/>)} />
      <Route path="retailer">
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
            <RoleRoute allowedRole={"producer"} redirectPath="/">
              {(<ProducerRetailerMarketplace/>)}
            </RoleRoute>
          }
        />
      </Route>

      <Route path="producer">
        <Route
          path="marketplace"
          element={
            <RoleRoute allowedRole={"retailer"} redirectPath="/">
              {(<ProducerMarketplace/>)}
            </RoleRoute>
          }
        />
      </Route>
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
  const warm = () => prefetchPaths(likelyPathsForRole({}).slice(0, 3));
  const ric = window.requestIdleCallback;
  if (ric) {
    ric(warm, {timeout: 1500});
  } else {
    window.setTimeout(warm, 350);
  }
}
