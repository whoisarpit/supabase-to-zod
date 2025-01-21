// Helper function to convert snake_case to PascalCase
export const toPascalCase = (str: string): string => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

// Helper function to convert TypeScript types to Zod schemas
export const generateZodSchema = (
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
