import { neon } from "@neondatabase/serverless";

const connectionURI = process.env.DB_URL;
if (!connectionURI) {
    throw new Error("DB_URL environment variable is not set");
}
export const sql = neon(connectionURI)