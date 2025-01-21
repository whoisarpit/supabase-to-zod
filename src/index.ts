#!/usr/bin/env node
import { logger } from "./utils/logger";
import { main } from "./cli";
import { generateZodSchemas } from "./generators/zod-generator";

// Only run main if this file is being run directly
if (require.main === module) {
  main().catch((error) => {
    logger.error(`Unhandled error: ${error}`);
    process.exit(1);
  });
}

export { generateZodSchemas };
