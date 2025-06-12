import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Introducing a delay of 2 seconds (2000 milliseconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Respond after the delay
    return NextResponse.json(
      { message: "Database connected successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
