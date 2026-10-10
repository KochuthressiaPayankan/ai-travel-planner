# AI Travel Planner

Enter a destination, budget and number of days, and get a full trip: activities, restaurants and a day-by-day itinerary, with estimated costs. Trips can be saved and reopened later.

## Tech
- Next.js (App Router), TypeScript, Tailwind CSS
- Google Gemini API with structured JSON output, validated with Zod
- localStorage for saved trips

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` (free key from Google AI Studio)
3. `npm run dev` and open http://localhost:3000

## Possible next steps
- Show stops on a Google Map
- Move saved trips from localStorage to a database

