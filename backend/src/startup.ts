import fs from "fs";
import { loadEnv, ENV } from "./config/env.js";

console.log("Loading environment variable");
loadEnv();

console.log("Creating storage directory");
fs.mkdirSync(ENV().AVATAR_IMAGE_DIR_PATH, { recursive: true });
fs.mkdirSync(ENV().COVER_IMAGE_DIR_PATH, { recursive: true });
