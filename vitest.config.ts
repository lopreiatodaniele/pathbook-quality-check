import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()], test: { environment: "happy-dom", setupFiles: ["tests/setup.ts"], include: ["tests/*.test.ts", "tests/*.test.tsx"], coverage: { provider: "istanbul", include: ["src/model.ts", "src/controller.ts", "src/debounce.ts", "src/BookingForm.tsx", "src/api.ts"], reporter: ["text", "html", "json-summary"] } } });
