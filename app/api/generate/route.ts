import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { NextResponse } from "next/server";
import { TripSchema } from "@/lib/schema";

export async function POST(req: Request) {
    const { destination, budget, days, currency } = await req.json();

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: `You are an expert travel planner. Only suggest real, well-known places and restaurants. Keep the total cost within the budget.

Plan a ${days}-day trip to ${destination} with a total budget of ${budget} ${currency}.`,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: z.toJSONSchema(TripSchema),
            },
        });

        const trip = TripSchema.parse(JSON.parse(response.text ?? ""));
        return NextResponse.json(trip);
    } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}