import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import {
  RetailerHomePage,
  RetailerCellarPage,
  RetailerMarketplacePage,
  RetailerProfilePage,
} from "./pages/Retailer";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App />}>
      <Route path="" element={<RetailerHomePage />} />
      <Route path="inventory" element={<RetailerCellarPage />} />
      <Route path="marketplace" element={<RetailerMarketplacePage />} />
      <Route path="profile" element={<RetailerProfilePage />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
