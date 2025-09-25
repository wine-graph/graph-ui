export interface Retailer {
  contactEmail: string;
  id: string;
  location?: RetailerLocation;
  logoUrl?: string;
  name: string;
  pos: string;
  website: string;
}

export interface RetailerInventory {
  description: string;
  externalItemId: string;
  name: string;
  price: string;
  producer: string;
  retailerId: string;
  source: string;
  vintage: number;
  varietal?: string;
  wineId: string;
  matched?: boolean;
}

export interface RetailerLocation {
  address: string;
  city: string;
  country: string;
  state: string;
  zip: string;
}

export const mockRetailer: Retailer[] = [
  {
    contactEmail: "manager@chswine.com",
    id: "r1",
    logoUrl: "/images/wineandco-logo.png",
    name: "Wine and Co",
    pos: "SQUARE",
    website: "https://www.chswine.com/",
    location: {
      address: "441 Meeting St Ste. B",
      city: "Charleston",
      state: "SC",
      country: "USA",
      zip: "29403",
    },
  },
  {
    contactEmail: "info@vinoselect.com",
    id: "r2",
    logoUrl: "/images/vinoselect-logo.png",
    name: "Vino Select",
    pos: "SQUARE",
    website: "https://www.vinoselect.com/",
    location: {
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      zip: "94105",
    },
  },
  {
    contactEmail: "contact@winemarket.com",
    id: "r3",
    logoUrl: "/images/winemarket-logo.png",
    name: "Wine Market",
    pos: "SHOPIFY",
    website: "https://www.winemarket.com/",
    location: {
      address: "456 Vine Ave",
      city: "Napa",
      state: "CA",
      country: "USA",
      zip: "94558",
    },
  },
  {
    contactEmail: "hello@corkandbarrel.com",
    id: "r4",
    logoUrl: "/images/corkandbarrel-logo.png",
    name: "Cork & Barrel",
    pos: "SQUARE",
    website: "https://www.corkandbarrel.com/",
    location: {
      address: "789 Oak St",
      city: "Portland",
      state: "OR",
      country: "USA",
      zip: "97205",
    },
  },
  {
    contactEmail: "sales@vintagecellars.com",
    id: "r5",
    logoUrl: "/images/vintagecellars-logo.png",
    name: "Vintage Cellars",
    pos: "SHOPIFY",
    website: "https://www.vintagecellars.com/",
    location: {
      address: "321 Grape Rd",
      city: "Sonoma",
      state: "CA",
      country: "USA",
      zip: "95476",
    },
  },
];

export const mockInventory: RetailerInventory[] = [
  {
    wineId: "w1",
    externalItemId: "KU346EH3JSHXWFOIH2EUJW2A",
    name: "Young Family",
    producer: "The Clam Farm",
    retailerId: "r1",
    vintage: 2020,
    varietal: "Pinot Noir",
    price: "$36.90",
    source: "CANONICAL",
    description: "Lovely beautiful wine",
  },
  {
    wineId: "w2",
    externalItemId: "RCKQTOXZK64TRTN6RF4SR4DB-1",
    name: "Austin Hope",
    producer: "Hope Family Wines",
    retailerId: "r1",
    vintage: 2018,
    varietal: "Cabernet Sauvignon",
    price: "$59.99",
    source: "SQUARE",
    description: "A bold Cabernet Sauvignon from Paso Robles.",
  },
  {
    wineId: "w3",
    externalItemId: "RCKQTOXZK64TRTN6RF4SR4DB-2",
    name: "Austin Hope",
    producer: "Hope Family Wines",
    retailerId: "r1",
    vintage: 2021,
    varietal: "Chardonnay",
    price: "$39.99",
    source: "CANONICAL",
    description: "Vibrant Chardonnay with notes of citrus and oak.",
  },
  {
    wineId: "w4",
    externalItemId: "RCKQTOXZK64TRTN6RF4SR4DB-3",
    name: "Austin Hope Reserve",
    producer: "Hope Family Wines",
    retailerId: "r1",
    vintage: 2021,
    varietal: "Blend",
    price: "$79.99",
    source: "SQUARE",
    description: "Premium blend with complex flavors and aromas.",
    matched: true,
  },
  {
    wineId: "w5",
    externalItemId: "TRERADF23098432084ERE0889",
    name: "Auctioneer",
    producer: "Auctioneer",
    retailerId: "r1",
    vintage: 2021,
    varietal: "Cabernet Sauvignon",
    price: "$45.00",
    source: "SQUARE",
    description: "Isabelle's favorite wine",
  },
  {
    wineId: "w6",
    externalItemId: "XCVMNCXV20384230948ZDF298-1",
    name: "Luli",
    producer: "Luli Wines",
    retailerId: "r1",
    vintage: 2023,
    varietal: "Chardonnay",
    price: "$39.99",
    source: "SQUARE",
    description:
      "The Luli Chardonnay was made from hand-picked fruit and whole-cluster pressed grapes.",
  },
  {
    wineId: "w7",
    externalItemId: "XCVMNCXV20384230948ZDF298-2",
    name: "Luli Monte Linda",
    producer: "Luli Wines",
    retailerId: "r1",
    vintage: 2022,
    varietal: "Pinot Noir",
    price: "$29.99",
    source: "CANONICAL",
    description: "Luli Pinot Noir is made with classic winemaking techniques.",
  },
  {
    wineId: "w9",
    externalItemId: "QERPI293784PIDF089324LJFDK",
    name: "Just a Wine",
    producer: "Producer",
    retailerId: "r1",
    vintage: 2023,
    varietal: "Chardonnay",
    price: "$15.99",
    source: "SQUARE",
    description: "Nothing special",
    matched: true,
  },
  {
    wineId: "w10",
    externalItemId: "ZZC20384ENEOWR0238498023FF",
    name: "Just Another Wine",
    producer: "Producer",
    retailerId: "r1",
    vintage: 2022,
    varietal: "Pinot Noir",
    price: "$17.99",
    source: "SQUARE",
    description: "Still nothing special",
  },
  // New inventory items for additional retailers

  {
    wineId: "w8",
    externalItemId: "VS-LULI-SB-2023",
    name: "Luli Sauvignon Blanc",
    producer: "Luli Wines",
    retailerId: "r2",
    vintage: 2023,
    price: "$21.99",
    source: "SQUARE",
    description:
      "Luli Sauvignon Blanc was made with classic winemaking techniques.",
  },
  {
    wineId: "w11",
    externalItemId: "CB-LULI-CHARD-2023",
    name: "Luli Chardonnay",
    producer: "Luli Wines",
    retailerId: "r4",
    vintage: 2023,
    price: "$38.99",
    source: "SQUARE",
    description:
      "The Luli Chardonnay was made from hand-picked fruit and whole-cluster pressed grapes.",
  },
];
