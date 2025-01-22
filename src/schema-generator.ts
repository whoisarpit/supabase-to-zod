import { writeFileSync, existsSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { Project, SyntaxKind, TypeAliasDeclaration, TypeLiteralNode } from "ts-morph";
import { logger } from "./logger";
import { toPascalCase } from "./utils";
import { generateZodSchema } from "./transformers";

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

// Main function to generate Zod schemas
export async function generateZodSchemas(
  inputSource: string,
  outputFile: string | null = null
): Promise<string> {
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

    // Store enum names for later reference
    const enumMap = new Map<string, string>();
    let output = "import { z } from 'zod';\n\n";

    // Generate enum schemas
    output += "// Enum Schemas\n";
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
