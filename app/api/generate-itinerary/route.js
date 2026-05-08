import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Use a server-only env var (no NEXT_PUBLIC_ prefix for secret keys)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    const preferences = await req.json();

    // Validate required fields
    const required = ["destination", "startDate", "endDate", "companions", "experience", "budget", "stayPreference", "foodPreference"];
    for (const field of required) {
      if (!preferences[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert travel agent. Generate a detailed travel itinerary based on the following:
      
      Destination: ${preferences.destination}
      Duration: ${preferences.startDate} to ${preferences.endDate}
      Companions: ${preferences.companions}
      Experience Type: ${preferences.experience}
      Budget: ${preferences.budget}
      Accommodation: ${preferences.stayPreference}
      Food Preference: ${preferences.foodPreference}

      Format the response in clean Markdown with:
      - A catchy trip title
      - A brief trip overview
      - Day-by-day activities with morning, afternoon, and evening plans
      - Recommended restaurants matching the food preference
      - Accommodation suggestions matching the stay preference
      - A detailed budget breakdown
      - Packing tips and travel advice
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (!text) throw new Error("Empty response from Gemini.");

    return NextResponse.json({ itinerary: text });

  } catch (error) {
    console.error("Gemini AI Error:", error);

    if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("401")) {
      return NextResponse.json(
        { error: "Invalid Gemini API Key. Please check your GEMINI_API_KEY environment variable." },
        { status: 401 }
      );
    }

    if (error.message?.includes("quota") || error.message?.includes("429")) {
      return NextResponse.json(
        { error: "API quota exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate itinerary. Please try again." },
      { status: 500 }
    );
  }
}