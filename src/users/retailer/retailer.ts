export type Retailer = {
  contactEmail: string;
  id: string;
  location?: RetailerLocation;
  logoUrl?: string;
  name: string;
  pos: string;
  inventory?: RetailerInventory[];
}

type RetailerInventory = {
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

type RetailerLocation = {
  address: string;
  city: string;
  country?: string;
  state: string;
  zipCode: string;
  website: string;
  coordinates: LocationCoordinates;
}

type LocationCoordinates = {
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
      zipCode: "29403",
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
      zipCode: "29403",
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
      zipCode: "29403",
      website: "https://www.graftchs.com/",
      coordinates: {
        latitude: 32.7764,
        longitude: -79.9310,
      }
    }
  }
];