import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {DiscoverPage} from "./pages/Discover.tsx";
import {HomePage} from "./pages/Home.tsx";
import {ProfilePage} from "./pages/Profile.tsx";
import {MarketplacePage} from "./pages/Marketplace.tsx";
import {ApolloProvider} from "@apollo/client";
import domainClient from "./services/DomainClient.ts";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="" element={<App/>}>
            <Route index element={<HomePage userType={""}/>}/>
            <Route path="explore" element={<DiscoverPage/>}/>
            <Route path="marketplace" element={<MarketplacePage/>}/>
            <Route path="profile" element={<ProfilePage/>}/>
        </Route>
    )
);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ApolloProvider client={domainClient}>
            <RouterProvider router={router}/>
        </ApolloProvider>
    </StrictMode>
);
