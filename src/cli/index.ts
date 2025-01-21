import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as process from "node:process";
import * as readline from "node:readline";
import { generateZodSchemas } from "../generators/zod-generator";
import { logger } from "../utils/logger";

// Helper function to read input from stdin
export const readStdin = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    let input = "";
    rl.on("line", (line) => {
      input += line + "\n";
    });

    rl.on("close", () => {
      resolve(input);
    });

    rl.on("error", (err) => {
      reject(err);
    });
  });
};

// CLI argument parsing
export const parseArgs = (): {
  inputFile: string | null;
  outputFile: string | null;
  isPiped: boolean;
} => {
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

// CLI entry point
export const main = async (): Promise<void> => {
  const { inputFile, outputFile, isPiped } = parseArgs();

  // Print help if requested
  if (process.argv.includes("-h") || process.argv.includes("--help")) {
    process.stdout.write(help);
    process.exit(0);
  }

  // Handle input source
  let inputSource: string;
  if (isPiped) {
    inputSource = await readStdin();
  } else if (inputFile) {
    inputSource = readFileSync(inputFile, "utf8");
  } else {
    logger.error(`No input source provided. Use -i or pipe input.\n\n${help}`);
    process.exit(1);
  }

  // Generate schemas
  const schemas = await generateZodSchemas(inputSource, outputFile);

  // If no output file, print to stdout
  if (!outputFile) {
    process.stdout.write(schemas);
  }
};
