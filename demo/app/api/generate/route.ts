import { generateZodSchemas } from "../../../../src";
import { NextResponse } from "next/server";

/**
 * Handles GET requests to generate Zod schemas based on provided types.
 * @param {Request} request - The incoming HTTP request object containing JSON data with types.
 * @returns {Promise<NextResponse>} A Promise that resolves to a NextResponse object containing either the generated Zod schemas or an error message.
 * @throws {Error} If an error occurs during schema generation or request processing.
 */
export async function GET(request: Request) {
  try {
    const { types } = await request.json();
    const result = await generateZodSchemas(types);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 400 }
    );
  }
}
