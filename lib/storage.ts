import type { Trip } from "./schema";

export type SavedTrip = { id: string; savedAt: string; trip: Trip };

const KEY = "ai-travel-planner:trips";

export function loadTrips(): SavedTrip[] {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function write(trips: SavedTrip[]) {
    try {
        localStorage.setItem(KEY, JSON.stringify(trips));
    } catch {
        // storage full or blocked: ignore
    }
}

export function saveTrip(trip: Trip): SavedTrip[] {
    const entry: SavedTrip = {
        id: crypto.randomUUID(),
        savedAt: new Date().toISOString(),
        trip,
    };
    const all = [entry, ...loadTrips()];
    write(all);
    return all;
}

export function deleteTrip(id: string): SavedTrip[] {
    const all = loadTrips().filter((t) => t.id !== id);
    write(all);
    return all;
}