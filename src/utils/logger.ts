import * as process from "node:process";

export const logger = {
  info: (message: string): void => {
    if (process.env.NODE_ENV !== "production") {
      process.stderr.write(`[INFO] ${message}\n`);
    }
  },
  error: (message: string): void => {
    process.stderr.write(`[ERROR] ${message}\n`);
  },
};
