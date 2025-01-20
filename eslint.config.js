// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default tseslint.config(
  {
    ignores: [
      "**/dist/",
      "**/node_modules/",
      ".git/",
      "**/*.js",
      "example/*.ts",
      "example/*.zod.ts",
      "*.generated.ts",
      "*.zod.ts",
      "*.config.js",
      "*.json",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: prettier,
    },
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Essential TypeScript rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // Basic error prevention
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-unused-expressions": "error",

      // Potential error rules
      "no-constant-condition": "error",
      "no-duplicate-imports": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",

      // Performance and best practices
      "no-return-await": "warn",
      "prefer-const": "error",
      "no-var": "error",
    },
  }
);
