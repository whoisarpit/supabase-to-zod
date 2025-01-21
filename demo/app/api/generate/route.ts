import { generateZodSchemas } from "../../../../src";
import { NextResponse } from "next/server";

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
