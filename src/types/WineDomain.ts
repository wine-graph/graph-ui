export interface Country {
    id: string;
    name: string;
    description: string;
    flag?: string;
    weblink?: string;
}

export interface Region {
    id: string;
    name: string;
    countryId: string;
    description?: string;
    weblink?: string;
}

export interface Area {
    id: string;
    name: string;
    regionId: string;
    description?: string;
}

export interface Grape {
    id: string;
    name: string;
    color: string; // 'RED' | 'WHITE' | 'PINK'
    description?: string;
    originCountryId?: string;
}

export const mockRegions: Region[] = [
    { id: "r1", name: "California", countryId: "c1" },
    { id: "r2", name: "Oregon", countryId: "c1" },
    { id: "r3", name: "Burgundy", countryId: "c2" },
    { id: "r4", name: "Sonoma", countryId: "c1" },
    { id: "r5", name: "Mendoza", countryId: "c3" },
    { id: "r6", name: "Marlborough", countryId: "c4" }
];

export const mockAreas: Area[] = [
    { id: "a1", name: "Napa Valley AVA", regionId: "r1", description: "World-renowned AVA in Northern California." },
    { id: "a2", name: "Russian River Valley", regionId: "r1" },
    { id: "a3", name: "Côte de Nuits", regionId: "r2" },
    { id: "a4", name: "Sonoma Coast", regionId: "r4", description: "Cool-climate region ideal for Pinot Noir and Chardonnay." },
    { id: "a5", name: "Uco Valley", regionId: "r5", description: "High-elevation region producing bold reds in Argentina." },
    { id: "a6", name: "Wairau Valley", regionId: "r6", description: "Known for bright and zesty Sauvignon Blancs in New Zealand." }
];

export const mockGrapes: Grape[] = [
    { id: "g1", name: "Pinot Noir", color: "RED", originCountryId: "c2" },
    { id: "g2", name: "Chardonnay", color: "WHITE", originCountryId: "c2" },
    { id: "g3", name: "Cabernet Sauvignon", color: "RED", originCountryId: "c1" },
    { id: "g4", name: "Sauvignon Blanc", color: "WHITE", originCountryId: "c4" },
    { id: "g5", name: "Malbec", color: "RED", originCountryId: "c3" },
    { id: "g6", name: "Syrah", color: "RED", originCountryId: "c2" }
];