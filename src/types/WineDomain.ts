export interface Country {
    id: string;
    name: string;
    description: string;
    flag?: string;
    weblink?: string;
    regions: Region[];
}

export interface Region {
    id: string;
    name: string;
    description?: string;
    weblink?: string;
    areas: Area[];
}

export interface Area {
    id: string;
    name: string;
    description?: string;
}

export interface Grape {
    id: string;
    name: string;
    color: string;
    description?: string;
}