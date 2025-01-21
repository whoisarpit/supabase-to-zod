import { Project, TypeLiteralNode, TypeAliasDeclaration } from "ts-morph";

export type CliArgs = {
  inputFile: string | null;
  outputFile: string | null;
  isPiped: boolean;
};

export type ProjectConfig = {
  compilerOptions: {
    strictNullChecks: boolean;
  };
};