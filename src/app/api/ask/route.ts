import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const aiEndpoint = process.env.AI_API_ENDPOINT;

    if (!aiEndpoint) {
      console.error("AI_API_ENDPOINT is not configured in environment variables.");
      return NextResponse.json({ error: "Backend configuration error" }, { status: 500 });
    }

    // Proxy the request to the Hugging Face AI endpoint
    const response = await fetch(aiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Passing the question directly; adjust payload structure if the backend expects a different format
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI Backend Error:", response.status, errText);
      throw new Error(`AI API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // The response data structure depends on the backend. We will return it as-is to the frontend.
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error proxying to AI:", error);
    return NextResponse.json(
      { error: "Failed to get guidance from AI. Please try again later." },
      { status: 500 }
    );
  }
}
