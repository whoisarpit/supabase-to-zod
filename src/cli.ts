import * as process from "node:process";
import { resolve } from "node:path";
import { CliArgs } from "./types";

export const help = `
Supabase to Zod Type Generator

Usage:
  supabase-to-zod [options]
  supabase gen types | supabase-to-zod [options]

Options:
  -i, --input    Input TypeScript file (required)
  -o, --output   Output Zod schemas file (optional)
  -h, --help     Show this help message

Examples:
  supabase-to-zod
  supabase-to-zod -i ./custom-types.ts
  supabase-to-zod -o ./zod-schemas.ts
  supabase gen types | supabase-to-zod
  supabase gen types | supabase-to-zod -o ./zod-schemas.ts
`;

export const parseArgs = (): CliArgs => {
  const args = process.argv.slice(2);
  const inputFileIndex = args.findIndex((arg) => arg === "-i" || arg === "--input");
  const outputFileIndex = args.findIndex((arg) => arg === "-o" || arg === "--output");

  const isPiped = !process.stdin.isTTY;
  const inputFile = inputFileIndex !== -1 ? args[inputFileIndex + 1] : isPiped ? null : undefined;

  const outputFile = outputFileIndex !== -1 ? args[outputFileIndex + 1] : null;

  return {
    inputFile: inputFile ? resolve(process.cwd(), inputFile) : null,
    outputFile: outputFile ? resolve(process.cwd(), outputFile) : null,
    isPiped,
  };
};
