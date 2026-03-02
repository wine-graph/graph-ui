const prefetched = new Set<string>();

export const routeLoaders = {
  graphFeed: () => import("../pages/GraphFeed.tsx"),
  discover: () => import("../pages/Discover.tsx").then((m) => ({default: m.DiscoverPage})),
  profile: () => import("../pages/Profile.tsx").then((m) => ({default: m.ProfilePage})),
  marketplace: () => import("../pages/Marketplace.tsx").then((m) => ({default: m.MarketplacePage})),
  producerMarketplace: () => import("../users/producer/ProducerMarketplace.tsx").then((m) => ({default: m.ProducerMarketplace})),
  retailerMarketplace: () => import("../users/retailer/RetailerMarketplace.tsx").then((m) => ({default: m.RetailerMarketplace})),
  retailerInventory: () => import("../users/retailer/inventory/RetailerInventoryPage.tsx").then((m) => ({default: m.RetailerInventoryPage})),
  retailerProfile: () => import("../users/retailer/RetailerProfile.tsx").then((m) => ({default: m.RetailerProfile})),
  retailerCellar: () => import("../users/retailer/RetailerCellar.tsx").then((m) => ({default: m.RetailerCellar})),
  producerProfile: () => import("../users/producer/ProducerProfile.tsx").then((m) => ({default: m.ProducerProfile})),
  producerInventory: () => import("../users/producer/ProducerInventory.tsx"),
  producerPage: () => import("../pages/ProducerPage.tsx"),
  winePage: () => import("../pages/WinePage.tsx"),
} as const;

type LoaderKey = keyof typeof routeLoaders;
type UserRole = "retailer" | "producer" | "enthusiast" | "visitor" | string;

function getLoaderKeysForPath(path: string): LoaderKey[] {
  const clean = path.split("?")[0].split("#")[0];

  if (clean === "/") return ["graphFeed"];
  if (clean === "/explore") return ["discover"];
  if (clean === "/marketplace") return ["marketplace"];
  if (clean === "/profile") return ["profile"];
  if (clean === "/retailer/marketplace") return ["producerMarketplace"];
  if (clean === "/producer/marketplace") return ["retailerMarketplace"];
  if (/^\/retailer\/[^/]+\/inventory$/.test(clean)) return ["retailerInventory"];
  if (/^\/retailer\/[^/]+\/profile$/.test(clean)) return ["retailerProfile"];
  if (/^\/retailer\/[^/]+\/cellar$/.test(clean)) return ["retailerCellar"];
  if (/^\/producer\/[^/]+\/profile$/.test(clean)) return ["producerProfile"];
  if (/^\/producer\/[^/]+\/cellar$/.test(clean)) return ["producerInventory"];
  if (/^\/producer\/[^/]+\/[^/]+$/.test(clean)) return ["producerPage"];
  if (/^\/wine\/[^/]+\/[^/]+$/.test(clean)) return ["winePage"];

  return [];
}

export function prefetchPath(path: string) {
  const keys = getLoaderKeysForPath(path);
  keys.forEach((key) => {
    if (prefetched.has(key)) return;
    prefetched.add(key);
    void routeLoaders[key]();
  });
}

export function prefetchPaths(paths: string[]) {
  paths.forEach(prefetchPath);
}

type LikelyPathOptions = {
  role?: UserRole;
  retailerId?: string;
  producerId?: string;
};

export function likelyPathsForRole({role, retailerId, producerId}: LikelyPathOptions): string[] {
  const normalized = (role ?? "visitor").toLowerCase();

  if (normalized === "retailer") {
    const paths = ["/", "/retailer/marketplace", "/marketplace", "/profile"];
    if (retailerId) paths.push(`/retailer/${retailerId}/cellar`, `/retailer/${retailerId}/profile`);
    return paths;
  }

  if (normalized === "producer") {
    const paths = ["/", "/producer/marketplace", "/explore", "/profile"];
    if (producerId) paths.push(`/producer/${producerId}/cellar`, `/producer/${producerId}/profile`);
    return paths;
  }

  return ["/", "/explore", "/marketplace", "/profile"];
}
