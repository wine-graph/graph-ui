import axios from "axios";
import type {User} from "../context/authContext.ts";

const BASE_URL = import.meta.env.DEV
  ? "http://localhost:8086"
  : "https://wine-retailer.fly.dev";

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: false
});

export async function getCurrentUser(): Promise<User | undefined> {
  const {data} = await client.get("/session/user");
  return data as User | undefined;
}
