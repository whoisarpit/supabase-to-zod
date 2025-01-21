#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { readStdin } from "./cli/io";
import { parseArgs } from "./cli/args";
import { logger } from "./cli/logger";
import { generateZodSchemas } from "./core/schema-generator";

const help = `
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
const main = async (): Promise<void> => {
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

// Only run main if this file is being run directly
if (require.main === module) {
  main().catch((error) => {
    logger.error(`Unhandled error: ${error}`);
    process.exit(1);
  });
}

export { generateZodSchemas };
