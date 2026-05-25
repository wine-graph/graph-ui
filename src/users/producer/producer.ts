export type Producer = {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  website?: string;
  description?: string;
  createdAt?: string;
  logo?: number[];
  wineCount?: number;
  wines?: Wine[];
  social?: ProducerSocialLink[];
}

export type SocialProvider = "FACEBOOK" | "INSTAGRAM" | "TWITTER";

export type ProducerSocialLink = {
  provider?: SocialProvider | string | null;
  url?: string | null;
}

export type Wine = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  vintage : string;
  varietal: string;
  createdAt?: string;
  matchCount?: number;
}

export type WineEnriched = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  vintage : string;
  varietal: string;
  createdAt?: string;
  matchCount?: number;
  producer?: WineProducer;
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
