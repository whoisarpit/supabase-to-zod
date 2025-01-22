import * as readline from "node:readline";
import * as process from "node:process";

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

// Helper function to convert snake_case to PascalCase
export const toPascalCase = (str: string): string => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};
