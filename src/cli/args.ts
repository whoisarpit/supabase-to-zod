import * as process from "node:process";
import { resolve } from "node:path";
import { CliArgs } from "../core/types";

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