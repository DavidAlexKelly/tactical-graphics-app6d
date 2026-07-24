// eslint.config.js — flat config (ESLint 9+). Kept intentionally light:
// this is a small, dependency-free library, not an app — the goal is
// catching real mistakes (unused vars, floating promises, accidental
// `any`-widening) without fighting the parametric-graphics code style.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    rules: {
      // Params/generate/handles functions across the symbol catalog lean
      // on structural typing over a plain `Params = Record<string, any>`
      // substrate (see engine/types.ts) — that's a deliberate design
      // choice, not something lint should fight symbol-by-symbol.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-console": "warn",
    },
  },
  {
    files: ["src/react/**/*.ts", "src/react/**/*.tsx"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    files: ["src/**/*.test.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);
