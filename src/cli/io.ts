import * as readline from "node:readline";
import * as process from "node:process";

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