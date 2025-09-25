export interface Producer {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    website?: string;
    description: string;
    areaId: string;
    introOffer?: boolean;
}

export const mockProducers: Producer[] = [
    {
        id: "p1",
        name: "Just a Producer",
        email: "info@producer.com",
        phone: "+1-707-555-0000",
        website: "https://producer.com",
        description: "Generic producer for various wines.",
        areaId: "california",
        introOffer: false
    },
    {
        id: "p2",
        name: "Auctioneer",
        email: "info@auctioneer.com",
        phone: "+1-707-555-1111",
        website: "https://auctioneer.com",
        description: "Specializing in premium Cabernet Sauvignon.",
        areaId: "napa-valley",
        introOffer: true
    },
    {
        id: "p3",
        name: "The Clam Farm",
        email: "info@clamfarm.com",
        phone: "+1-707-555-2222",
        website: "https://clamfarm.com",
        description: "Known for their Young Family Pinot Noir.",
        areaId: "santa-lucia-highlands",
        introOffer: false
    },
    {
        id: "p4",
        name: "Hope Family Wines",
        email: "info@hopefamilywines.com",
        phone: "+1-707-555-3333",
        website: "https://hopefamilywines.com",
        description: "Family-owned winery producing a range of premium wines including the Austin Hope series.",
        areaId: "paso-robles",
        introOffer: true
    },
    {
        id: "p5",
        name: "Luli Wines",
        email: "info@luliwines.com",
        phone: "+1-707-555-4444",
        website: "https://luliwines.com",
        description: "Producing high-quality wines using classic winemaking techniques with a focus on Chardonnay, Pinot Noir, and Sauvignon Blanc.",
        areaId: "santa-lucia-highlands",
        introOffer: true
    }
];