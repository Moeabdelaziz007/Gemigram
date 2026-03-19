import { NextResponse } from "next/server";
import { NeuralRouter } from "@/lib/neural/router";
import { NeuralProvider } from "@/lib/neural/types";

const router = new NeuralRouter();

export async function POST(req: Request) {
  try {
    const { provider, messages, options } = await req.json();

    if (!provider || !messages) {
      return NextResponse.json(
        { error: "Missing required fields: provider or messages." },
        { status: 400 }
      );
    }

    const response = await router.generate(provider as NeuralProvider, messages, options);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("[Neural_Router_Failure]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate neural response." },
      { status: 500 }
    );
  }
}
