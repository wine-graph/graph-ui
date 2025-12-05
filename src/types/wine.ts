export type Wine = {
    id: string;
    name: string;
    slug: string;
    vintage: number;
    varietal: string;
    size: number;
    producer: string;
    color: "RED" | "WHITE" | "ROSE" | "ORANGE";
    closure: "NATURAL_CORK" | "SCREW_CAP" | "SYNTHETIC_CORK" | "TECHNICAL_CORK" | "VALVE" | "VINO_SEAL" | "ZORK" | "OTHER";
    shape: "ALSACE" | "BORDEAUX" | "BURGUNDY" | "CALIFORNIA" | "CHAMPAGNE" | "RHONE" | "BOX" | "OTHER";
    type: "STILL" | "SPARKLING" | "FRIZZANTE";
    description?: string;
    alcohol?: number;
    acid?: number;
    pH?: number;
    bottleAging?: number;
    subarea?: string;
    weblink?: string;
    wineComponents?: WineGrape[];
}

type WineGrape = {
  grapeId: string;
  grapeName: string;
  percentage: number;
  harvestBegin?: string;
  harvestEnd?: string;
  fermentation?: {
    days?: number;
    temperature?: number;
  };
  maceration?: {
    days?: number;
    temperature?: number;
  };
}