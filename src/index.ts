#!/usr/bin/env node
import { readFileSync } from "node:fs";
import * as process from "node:process";
import { help, parseArgs } from "./cli";
import { logger } from "./logger";
import { readStdin } from "./utils";
import { generateZodSchemas } from "./schema-generator";

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

// Only run main if this file is being run directly
if (require.main === module) {
  main().catch((error) => {
    logger.error(`Unhandled error: ${error}`);
    process.exit(1);
  });
}

export { generateZodSchemas } from "./schema-generator";
