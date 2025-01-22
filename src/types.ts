import { z } from "zod";
import { Project, TypeAliasDeclaration, TypeLiteralNode } from "ts-morph";

// CLI Arguments interface
export interface CliArgs {
  inputFile: string | null;
  outputFile: string | null;
  isPiped: boolean;
}

// Logger interface
export interface Logger {
  info: (message: string) => void;
  error: (message: string) => void;
}
