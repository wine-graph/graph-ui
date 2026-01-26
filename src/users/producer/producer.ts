export type Producer = {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  website?: string;
  description?: string;
  createdAt?: string;
  wines?: Wine[];
  areas?: string[];
}

export type Wine = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  vintage : string;
  varietal: string;
  createdAt?: string;
}

export type WineEnriched = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  vintage : string;
  varietal: string;
  createdAt?: string;
  producer: WineProducer;
  retailers?: WineRetailer[];
}

export type WineProducer = {
  id: string;
  name: string;
  slug: string;
}

export type WineRetailer = {
  id: string; // merchant ID
  name: string; // merchant name
}