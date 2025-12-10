import fs from "fs";
import { loadEnv, ENV } from "./config/env.js";

// --- ENVIRONMENT SETUP ---

console.log("Loading environment variable");
// must call before use ENV() getter
// exit process if missing environment variable
loadEnv();

// --- STORAGE SETUP ---

console.log("Creating storage directory");
// Create and ensures local directories (and parents) for user-uploaded content exist.
fs.mkdirSync(ENV().AVATAR_IMAGE_DIR_PATH, { recursive: true });
fs.mkdirSync(ENV().COVER_IMAGE_DIR_PATH, { recursive: true });
