import type {Wine, WineExtraction, ImportResult} from "./types";
import axios from "axios";

const BASE_URL = import.meta.env.DEV
  ? "http://localhost:8083"
  : "https://wine-producer.fly.dev";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // disable since we aren't using cookies for auth
});

// Upload CSV for extraction
export async function uploadProducerWinesCsv(producerId: string, file: File): Promise<WineExtraction> {
  const form = new FormData();
  form.append("file", file);
  const {data} = await api.put(`/producer/${encodeURIComponent(producerId)}/wines/upload`, form, {
    headers: {"Content-Type": "multipart/form-data"},
  });
  return data as WineExtraction;
}

// Confirm and persist wines (placeholder REST endpoint for MVP)
export async function confirmProducerWines(producerId: string, wines: Wine[]): Promise<ImportResult> {
  const {data} = await api.post(`/producer/${encodeURIComponent(producerId)}/wines/confirm`, {wines});
  return data as ImportResult;
}
