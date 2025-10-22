export interface Retailer {
  contactEmail: string;
  id: string;
  location?: RetailerLocation;
  logoUrl?: string;
  name: string;
  pos: string;
  inventory?: RetailerInventory[];
}

export interface RetailerInventory {
  description: string;
  externalItemId: string;
  name: string;
  price?: string;
  producer: string;
  retailerId: string;
  source: string;
  vintage: number;
  varietal: string;
  wineId: string;
  matched?: boolean;
}

export interface RetailerLocation {
  address: string;
  city: string;
  country: string;
  state: string;
  zip: string;
  website: string;
  coordinates: LocationCoordinates;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export const mockRetailer: Retailer[] = [
  {
    contactEmail: "manager@chswine.com",
    id: "r1",
    name: "Wine and Co",
    pos: "CLOVER",
    location: {
      address: "441 Meeting St Ste. B",
      city: "Charleston",
      state: "SC",
      country: "USA",
      zip: "29403",
      website: "https://www.chswine.com/",
      coordinates: {
        latitude: 32.7767,
        longitude: -79.9311,
      }
    }
  },
  {
    contactEmail: "info@monarchwinemerchants.com",
    id: "r2",
    name: "Monarch Wine Merchants",
    pos: "SQUARE",
    location: {
      address: "1107 King St. Suite B",
      city: "Charleston",
      state: "SC",
      country: "USA",
      zip: "29403",
      website: "https://www.monarchwinemerchants.com/",
      coordinates: {
        latitude: 32.7909,
        longitude: -79.9405,
      }
    }
  },
  {
    contactEmail: "info@graftchs.com",
    id: "r3",
    name: "Graft",
    pos: "SQUARE",
    location: {
      address: "700b King St",
      city: "Charleston",
      state: "SC",
      country: "USA",
      zip: "29403",
      website: "https://www.graftchs.com/",
      coordinates: {
        latitude: 32.7764,
        longitude: -79.9310,
      }
    }
  }
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
  }
];
