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
  contactEmail: string;
  phone: string;
  coordinates: LocationCoordinates;
}

type LocationCoordinates = {
  latitude: number;
  longitude: number;
}