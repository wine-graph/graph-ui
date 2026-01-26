export type Retailer = {
  id: string;
  location?: RetailerLocation;
  logoUrl?: string;
  name: string;
  pos: string;
  inventory?: RetailerInventory[];
}

export type RetailerInventory = {
  canonicalId: string;
  name: string;
  vintage: string;
  varietal: string;
  slug: string;
  id: string;
}

export type RetailerLocation = {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  website: string;
  contactEmail: string;
  phone: string;
  coordinates: LocationCoordinates;
}

export type LocationCoordinates = {
  latitude: number;
  longitude: number;
}