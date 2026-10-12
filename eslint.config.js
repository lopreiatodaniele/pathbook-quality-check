import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
export default tseslint.config({ ignores: ["node_modules/**", "package-cache/**", "dist/**", "coverage/**", "test-results/**", "playwright-report/**", "tmp/**"] }, js.configs.recommended, ...tseslint.configs.recommended, { languageOptions: { globals: { ...globals.browser, ...globals.node, Bun: "readonly" } } });
