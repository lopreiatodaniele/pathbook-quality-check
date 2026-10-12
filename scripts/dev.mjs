import { createServer } from "vite";
import { startApi } from "../server.mjs";
const api = startApi();
let vite;
try { vite = await createServer(); await vite.listen(); console.log("Quality workshop: http://127.0.0.1:4230 (loopback only)"); }
catch (error) { api.stop(true); throw error; }
async function close() { await vite.close(); api.stop(true); process.exit(0); }
process.on("SIGINT", close); process.on("SIGTERM", close);
