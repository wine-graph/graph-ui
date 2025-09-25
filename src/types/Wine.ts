export interface WineGrape {
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

export interface Wine {
    id: string;
    name: string;
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
    pricePerBottle?: number;
}

export const mockWines: Wine[] = [
    {
        id: "w1",
        name: "Young Family Pinot Noir",
        vintage: 2020,
        varietal: "Pinot Noir",
        size: 750,
        producer: "The Clam Farm",
        color: "RED",
        closure: "OTHER",
        shape: "BURGUNDY",
        type: "STILL",
        description: "Lovely beautiful wine",
        alcohol: 13.5,
        acid: 5.8,
        pH: 3.6,
        bottleAging: 10,
        subarea: "Santa Lucia Highlands",
        pricePerBottle: 36.90,
        wineComponents: [
            {
                grapeId: "g1",
                grapeName: "Pinot Noir",
                percentage: 100
            }
        ]
    },
    {
        id: "w2",
        name: "Austin Hope Cabernet Sauvignon",
        vintage: 2018,
        size: 750,
        varietal: "Cabernet Sauvignon",
        producer: "Hope Family Wines",
        color: "RED",
        closure: "NATURAL_CORK",
        shape: "BORDEAUX",
        type: "STILL",
        description: "A bold Cabernet Sauvignon from Paso Robles.",
        alcohol: 14.5,
        acid: 6.2,
        pH: 3.5,
        bottleAging: 18,
        subarea: "Paso Robles",
        pricePerBottle: 59.99,
        wineComponents: [
            {
                grapeId: "g3",
                grapeName: "Cabernet Sauvignon",
                percentage: 100
            }
        ]
    },
    {
        id: "w3",
        name: "Austin Hope Chardonnay",
        vintage: 2021,
        varietal: "Chardonnay",
        size: 750,
        producer: "Hope Family Wines",
        color: "WHITE",
        closure: "SCREW_CAP",
        shape: "BORDEAUX",
        type: "STILL",
        description: "Vibrant Chardonnay with notes of citrus and oak.",
        alcohol: 13.8,
        acid: 5.9,
        pH: 3.4,
        bottleAging: 8,
        subarea: "Central Coast",
        pricePerBottle: 39.99,
        wineComponents: [
            {
                grapeId: "g2",
                grapeName: "Chardonnay",
                percentage: 100
            }
        ]
    },
    {
        id: "w4",
        name: "Austin Hope Reserve Blend",
        vintage: 2021,
        size: 750,
        varietal: "Blend",
        producer: "Hope Family Wines",
        color: "RED",
        closure: "VALVE",
        shape: "BORDEAUX",
        type: "STILL",
        description: "Premium blend with complex flavors and aromas.",
        alcohol: 14.8,
        acid: 6.1,
        pH: 3.6,
        bottleAging: 24,
        subarea: "Paso Robles",
        pricePerBottle: 79.99,
        wineComponents: [
            {
                grapeId: "g3",
                grapeName: "Cabernet Sauvignon",
                percentage: 60
            },
            {
                grapeId: "g6",
                grapeName: "Syrah",
                percentage: 25
            },
            {
                grapeId: "g7",
                grapeName: "Merlot",
                percentage: 15
            }
        ]
    },
    {
        id: "w5",
        name: "Auctioneer Cabernet Sauvignon",
        vintage: 2021,
        varietal: "Cabernet Sauvignon",
        size: 750,
        producer: "Auctioneer",
        color: "RED",
        closure: "OTHER",
        shape: "BURGUNDY",
        type: "STILL",
        description: "Isabelle's favorite wine",
        alcohol: 14.2,
        acid: 5.7,
        pH: 3.55,
        bottleAging: 12,
        subarea: "Napa Valley",
        pricePerBottle: 45.00,
        wineComponents: [
            {
                grapeId: "g3",
                grapeName: "Cabernet Sauvignon",
                percentage: 100,
                fermentation: { days: 14, temperature: 25 },
                maceration: { days: 10, temperature: 20 }
            }
        ]
    },
    {
        id: "w6",
        name: "Luli Chardonnay",
        vintage: 2023,
        varietal: "Chardonnay",
        size: 750,
        producer: "Luli Wines",
        color: "WHITE",
        closure: "NATURAL_CORK",
        shape: "BURGUNDY",
        type: "STILL",
        description: "The Luli Chardonnay was made from hand-picked fruit and whole-cluster pressed grapes. The juice and wine is not settled so it goes to barrel and ages with original lees that contribute complexity to the wine. Fermentation was carried out in 100% neutral oak barrels. These neutral barrels give the wine great focused aromatics while bringing texture and mineral notes. Minimal less stirring keeps the wine exceptionally pure. Malo-lactic fermentation was prevented to preserve the bright aromatics",
        alcohol: 13.2,
        acid: 6.3,
        pH: 3.35,
        bottleAging: 6,
        subarea: "Santa Lucia Highlands",
        pricePerBottle: 39.99,
        wineComponents: [
            {
                grapeId: "g2",
                grapeName: "Chardonnay",
                percentage: 100
            }
        ]
    },
    {
        id: "w7",
        name: "Luli Monte Linda Pinot Noir",
        vintage: 2022,
        varietal: "Pinot Noir",
        size: 750,
        producer: "Luli Wines",
        color: "RED",
        closure: "NATURAL_CORK",
        shape: "BURGUNDY",
        type: "STILL",
        description: "Luli Pinot Noir is made with classic winemaking techniques: Hand-sorting of the fruit, native yeasts for fermentation and production in small lots. The wine was aged in 'neutral' French oak barrels and was not fined or filtered. Each barrel from the Monte Linda Vineyard is hand-selected, with only the best barrels being destined for this wine. The resulting balanced wine is a tribute to this vineyard's success with Pinot Noir.",
        alcohol: 13.8,
        acid: 5.9,
        pH: 3.5,
        bottleAging: 10,
        subarea: "Santa Lucia Highlands",
        pricePerBottle: 29.99,
        wineComponents: [
            {
                grapeId: "g1",
                grapeName: "Pinot Noir",
                percentage: 100
            }
        ]
    },
    {
        id: "w8",
        name: "Luli Sauvignon Blanc",
        vintage: 2023,
        varietal: "Sauvignon Blanc",
        size: 750,
        producer: "Luli Wines",
        color: "WHITE",
        closure: "SCREW_CAP",
        shape: "BORDEAUX",
        type: "STILL",
        description: "Luli Sauvignon Blanc was made with classic winemaking techniques: hand- sorting of the fruit, native yeasts for fermentation and production in small lots. The wine was fermented entirely in neutral barrels with limited lees contact—both which contribute complexity and texture to the wine. The resulting balanced wine is a tribute to the region's success with cool climate varieties and gentle winemaking.",
        alcohol: 12.5,
        acid: 6.5,
        pH: 3.2,
        bottleAging: 4,
        subarea: "Arroyo Seco",
        pricePerBottle: 19.99,
        wineComponents: [
            {
                grapeId: "g4",
                grapeName: "Sauvignon Blanc",
                percentage: 100
            }
        ]
    },
    {
        id: "w9",
        name: "Just a Wine Chardonnay",
        vintage: 2023,
        varietal: "Chardonnay",
        size: 750,
        producer: "Just a Producer",
        color: "WHITE",
        closure: "SCREW_CAP",
        shape: "BURGUNDY",
        type: "STILL",
        description: "Nothing special",
        alcohol: 13.0,
        acid: 5.5,
        pH: 3.4,
        bottleAging: 3,
        subarea: "California",
        pricePerBottle: 15.99,
        wineComponents: [
            {
                grapeId: "g2",
                grapeName: "Chardonnay",
                percentage: 100
            }
        ]
    },
    {
        id: "w10",
        name: "Just Another Wine Pinot Noir",
        vintage: 2022,
        varietal: "Pinot Noir",
        size: 750,
        producer: "Just a Producer",
        color: "RED",
        closure: "SYNTHETIC_CORK",
        shape: "BURGUNDY",
        type: "STILL",
        description: "Still nothing special",
        alcohol: 13.2,
        acid: 5.6,
        pH: 3.5,
        bottleAging: 6,
        subarea: "California",
        pricePerBottle: 17.99,
        wineComponents: [
            {
                grapeId: "g1",
                grapeName: "Pinot Noir",
                percentage: 100
            }
        ]
    }
];

// Retailer-related types moved to Retailer.ts