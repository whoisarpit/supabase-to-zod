#!/usr/bin/env node
import { writeFileSync, existsSync, readFileSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { Project, SyntaxKind, TypeAliasDeclaration, TypeLiteralNode } from "ts-morph";
import * as process from "node:process";
import * as readline from "node:readline";

// Simple logging utility
const logger = {
  info: (message: string): void => {
    if (process.env.NODE_ENV !== "production") {
      process.stderr.write(`[INFO] ${message}\n`);
    }
  },
  error: (message: string): void => {
    process.stderr.write(`[ERROR] ${message}\n`);
  },
};

// Helper function to read input from stdin
const readStdin = (): Promise<string> => {
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
const toPascalCase = (str: string): string => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

// Helper function to convert TypeScript types to Zod schemas
const generateZodSchema = (
  type: string,
  enumMap: Map<string, string>,
  isOptional = false
): string => {
  // Check if the type references an enum
  const enumMatch = /Database\["public"\]\["Enums"\]\["([^"]+)"\]/.exec(type);
  if (enumMatch) {
    const enumName = toPascalCase(enumMatch[1]) + "Enum";
    return isOptional ? `${enumName}.optional()` : enumName;
  }

  switch (type.toLowerCase()) {
    case "string":
      return isOptional ? "z.string().optional()" : "z.string()";
    case "number":
      return isOptional ? "z.number().optional()" : "z.number()";
    case "boolean":
      return isOptional ? "z.boolean().optional()" : "z.boolean()";
    case "json":
      return isOptional ? "z.any().optional()" : "z.any()";
    case "null":
      return "z.null()";
    default:
      if (type.includes("|")) {
        const types = type.split("|").map((t) => t.trim());
        const unionSchema = `z.union([${types
          .map((t) => generateZodSchema(t, enumMap))
          .join(", ")}])`;
        return isOptional ? `${unionSchema}.optional()` : unionSchema;
      }
      if (type.includes("[]")) {
        const baseType = type.replace("[]", "");
        const arraySchema = `z.array(${generateZodSchema(baseType, enumMap)})`;
        return isOptional ? `${arraySchema}.optional()` : arraySchema;
      }
      return isOptional ? "z.any().optional()" : "z.any()";
  }
};

// CLI argument parsing
const parseArgs = (): {
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

// Main function to generate Zod schemas
async function generateZodSchemas(
  inputSource: string,
  outputFile: string | null = null
): Promise<string> {
  // Initialize ts-morph project
  const project = new Project({
    compilerOptions: {
      strictNullChecks: true,
    },
  });

  try {
    // Temporary file to store input
    const tempFilePath = resolve(process.cwd(), "temp_types_db.ts");

    // Write input to temporary file
    writeFileSync(tempFilePath, inputSource);

    // Add the source file
    project.addSourceFileAtPath(tempFilePath);

    // Get the Database type
    const sourceFile = project.getSourceFiles()[0];
    logger.info("Source file found:");
    logger.info(sourceFile.getFilePath());

    const databaseType = sourceFile.getTypeAliasOrThrow("Database");
    logger.info("Database type found:");
    logger.info(databaseType.getName());

    // Helper function to extract table types
    const extractTableTypes = (declaration: TypeAliasDeclaration): TypeLiteralNode | null => {
      logger.info("Extracting table types...");
      const typeLiteral = declaration.getTypeNode()?.asKind(SyntaxKind.TypeLiteral);
      if (!typeLiteral) {
        logger.info("No type literal found");
        return null;
      }

      const publicProp = typeLiteral.getProperties().find((p) => p.getName() === "public");
      if (!publicProp) {
        logger.info("No public property found");
        return null;
      }

      const publicType = publicProp.getTypeNode()?.asKind(SyntaxKind.TypeLiteral);
      if (!publicType) {
        logger.info("No public type found");
        return null;
      }

      const tablesProp = publicType.getProperties().find((p) => p.getName() === "Tables");
      if (!tablesProp) {
        logger.info("No Tables property found");
        return null;
      }

      const tablesType = tablesProp.getTypeNode()?.asKind(SyntaxKind.TypeLiteral);
      logger.info("Tables found:");
      logger.info(tablesType ? "yes" : "no");
      return tablesType || null;
    };

    // Helper function to extract enum types
    const extractEnumTypes = (declaration: TypeAliasDeclaration): TypeLiteralNode | null => {
      logger.info("Extracting enum types...");
      const typeLiteral = declaration.getTypeNode()?.asKind(SyntaxKind.TypeLiteral);
      if (!typeLiteral) {
        logger.info("No type literal found");
        return null;
      }

      const publicProp = typeLiteral.getProperties().find((p) => p.getName() === "public");
      if (!publicProp) {
        logger.info("No public property found");
        return null;
      }

      const publicType = publicProp.getTypeNode()?.asKind(SyntaxKind.TypeLiteral);
      if (!publicType) {
        logger.info("No public type found");
        return null;
      }

      const enumsProp = publicType.getProperties().find((p) => p.getName() === "Enums");
      if (!enumsProp) {
        logger.info("No Enums property found");
        return null;
      }

      const enumsType = enumsProp.getTypeNode()?.asKind(SyntaxKind.TypeLiteral);
      logger.info("Enums found:");
      logger.info(enumsType ? "yes" : "no");
      return enumsType || null;
    };

    // Generate the Zod schemas
    let output = "import { z } from 'zod';\n\n";
    output += "// Enum Schemas\n";

    // Store enum names for later reference
    const enumMap = new Map<string, string>();

    // Generate enum schemas
    const enumTypes = extractEnumTypes(databaseType);
    if (enumTypes) {
      logger.info("Processing enum types...");
      enumTypes.getProperties().forEach((enumProp) => {
        const enumName = enumProp.getName();
        logger.info("Processing enum:");
        logger.info(enumName);
        const enumType = enumProp.getTypeNode();
        if (!enumType) return;

        const enumText = enumType.getText();
        const enumValues = enumText
          .split("|")
          .map((v) => v.trim().replace(/["\s]/g, ""))
          .filter(Boolean);

        if (enumValues.length > 0) {
          const pascalName = toPascalCase(enumName) + "Enum";
          enumMap.set(enumName, pascalName);
          output += `export const ${pascalName} = z.enum([${enumValues
            .map((v) => `'${v}'`)
            .join(", ")}]);\n`;
          output += `export type ${pascalName} = z.infer<typeof ${pascalName}>;\n\n`;
        }
      });
    }

    output += "// Table Schemas\n";

    // Generate table schemas
    const tableTypes = extractTableTypes(databaseType);
    if (tableTypes) {
      logger.info("Processing table types...");
      tableTypes.getProperties().forEach((tableProp) => {
        const tableName = tableProp.getName();
        const pascalName = toPascalCase(tableName);
        logger.info("Processing table:");
        logger.info(tableName);
        const tableType = tableProp.getTypeNode()?.asKind(SyntaxKind.TypeLiteral);
        if (!tableType) return;

        // Generate Row schema
        const rowProp = tableType.getProperties().find((p) => p.getName() === "Row");
        const rowType = rowProp?.getTypeNode()?.asKind(SyntaxKind.TypeLiteral);

        if (rowType) {
          output += `export const ${pascalName} = z.object({\n`;
          rowType.getProperties().forEach((prop) => {
            const propName = prop.getName();
            const propType = prop.getTypeNode()?.getText() || "any";
            const isOptional = propType.includes("|") && propType.includes("null");
            const baseSchema = generateZodSchema(propType.replace(" | null", ""), enumMap);
            const schema = isOptional ? `${baseSchema}.nullable()` : baseSchema;
            output += `  ${propName}: ${schema},\n`;
          });
          output += "});\n";
          output += `export type ${pascalName} = z.infer<typeof ${pascalName}>;\n\n`;
        }

        // Generate Insert schema
        const insertProp = tableType.getProperties().find((p) => p.getName() === "Insert");
        const insertType = insertProp?.getTypeNode()?.asKind(SyntaxKind.TypeLiteral);

        if (insertType) {
          output += `export const ${pascalName}Insert = z.object({\n`;
          insertType.getProperties().forEach((prop) => {
            const propName = prop.getName();
            const propType = prop.getTypeNode()?.getText() || "any";
            const isOptional =
              prop.hasQuestionToken() ||
              propType.includes("undefined") ||
              propName.endsWith("?") ||
              propType.includes("| null");
            const baseSchema = generateZodSchema(
              propType.replace(" | null", "").replace("?", ""),
              enumMap,
              isOptional
            );
            output += `  ${propName.replace("?", "")}: ${baseSchema},\n`;
          });
          output += "});\n";
          output += `export type ${pascalName}Insert = z.infer<typeof ${pascalName}Insert>;\n\n`;
        }

        // Generate Update schema
        const updateProp = tableType.getProperties().find((p) => p.getName() === "Update");
        const updateType = updateProp?.getTypeNode()?.asKind(SyntaxKind.TypeLiteral);

        if (updateType) {
          output += `export const ${pascalName}Update = z.object({\n`;
          updateType.getProperties().forEach((prop) => {
            const propName = prop.getName();
            const propType = prop.getTypeNode()?.getText() || "any";
            const baseSchema = generateZodSchema(
              propType.replace(" | null", "").replace("?", ""),
              enumMap,
              true
            );
            output += `  ${propName.replace("?", "")}: ${baseSchema},\n`;
          });
          output += "});\n";
          output += `export type ${pascalName}Update = z.infer<typeof ${pascalName}Update>;\n\n`;
        }
      });
    }

    // Write output
    if (outputFile) {
      writeFileSync(outputFile, output);
      logger.info("Zod schemas generated successfully!");
    }

    // Remove temporary file
    if (existsSync(tempFilePath)) {
      unlinkSync(tempFilePath);
    }

    return output;
  } catch (error) {
    logger.error(
      `Error generating Zod schemas: ${error instanceof Error ? error.message : String(error)}`
    );
    process.exit(1);
  }
}

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
