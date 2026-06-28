import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Enforce import type for type-only imports
      "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
      // Disallow unused variables (stricter than default)
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // No explicit any
      "@typescript-eslint/no-explicit-any": "error",
      // Disallow non-null assertions (use optional chaining instead)
      "@typescript-eslint/no-non-null-assertion": "warn",
      // No console.log in committed code (console.warn/error allowed for error boundaries)
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Prefer const
      "prefer-const": "error",
      // Enforce === over ==
      "eqeqeq": ["error", "always", { null: "ignore" }],
    },
  },
];

export default eslintConfig;
