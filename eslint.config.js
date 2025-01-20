// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/dist/", "**/node_modules/", ".git/", "**/*.js"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TypeScript-specific rules
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // General best practices
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      complexity: ["warn", 10],
      "max-depth": ["warn", 4],
      "max-lines-per-function": ["warn", 50],

      // Style consistency
      indent: ["error", 2],
      semi: ["error", "always"],
      quotes: ["error", "single"],
      "no-multiple-empty-lines": ["error", { max: 1 }],
    },
  }
);
