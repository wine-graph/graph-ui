export interface SquareMerchant {
    id: string;
    businessName: string;
    status: string;
    mainLocation: Location;
}

export interface Location {
    id: string;
    businessName: string;
    businessEmail: string;
    description: string;
    address: Address;
    coordinates: Coordinates;
}

export interface Address {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}