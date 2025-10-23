import axios from "axios";

const BASE_URL = import.meta.env.DEV
    ? "http://localhost:8086"
    : "https://wine-retailer.fly.dev";

export type SessionUser = {
    name: string;
    email: string;
    pictureUrl?: string;
};

export type SessionResponse = {
    authenticated: boolean;
    user?: SessionUser | null;
};

const client = axios.create({
    baseURL: BASE_URL,
    withCredentials: true // include cookies for auth
});

export async function getCurrentUser(): Promise<SessionResponse> {
    const {data} = await client.get("/session/user");

    const {name, email, pictureUrl} = data as SessionUser;
    const user: SessionUser = {
        name: name ?? "",
        email: email ?? "",
        ...(pictureUrl ? {pictureUrl} : {})
    };
    return {authenticated: true, user};
}
