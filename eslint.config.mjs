import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
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
    // New in eslint-config-next 16: flags any setState call inside a bare
    // useEffect body, including the standard "read a browser-only API
    // (localStorage/matchMedia) once on mount and sync it into state"
    // pattern this codebase relies on for SSR-hydration safety (Theme/
    // Language context, PointerOnlyEffects) and the equally standard
    // "reset derived state when a dependency changes" pattern (DecryptText,
    // TerminalIntro, AskFernando). Both are deliberate here, not oversights,
    // so this stays a warning instead of a hard error.
    "react-hooks/set-state-in-effect": "warn",
  },
}, {
  files: ["scripts/**"],
  rules: {
    // CLI tooling — printing results IS the point.
    "no-console": "off",
  },
}, {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}];

export default eslintConfig;
