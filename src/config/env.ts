import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(__dirname, "../../.env") });

if (!process.env.API_KEY)
    throw new Error("API_KEY is not defined in the environment variables.");

if (!process.env.DISCORD_TOKEN)
    throw new Error("DISCORD_TOKEN is not defined in the environment variables.");

export const API_KEY: string = process.env.API_KEY;
export const DISCORD_TOKEN: string = process.env.DISCORD_TOKEN;