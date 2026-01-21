export type Wine = {
  name: string;
  vintage?: number | null;
  varietals?: string[];
  description?: string;
};

export type WineExtraction = {
  producerId: string;
  wines: Wine[];
  errors?: { row: number; message: string }[];
};

export type ImportResult = {
  saved: number;
  skipped: number;
  failed: number;
  wines: Wine[]; // wines successfully saved
  errors?: { row: number; message: string }[];
};

export type ImportContext = {
  producerId: string;
  file?: File;
  extraction?: WineExtraction;
  editableWines: Wine[];
  result?: ImportResult;
  error?: string;
};

export type ImportState =
  | "idle"
  | "uploading"
  | "reviewing"
  | "confirming"
  | "success"
  | "error";
