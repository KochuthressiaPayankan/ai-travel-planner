"use client";
import { useEffect, useState } from "react";
import type { Trip } from "@/lib/schema";
import { loadTrips, saveTrip, deleteTrip, type SavedTrip } from "@/lib/storage";

function tripTotal(trip: Trip) {
  return trip.days.reduce(
    (sum, d) =>
      sum +
      d.activities.reduce((s, a) => s + a.estimatedCost, 0) +
      d.restaurants.reduce((s, r) => s + r.estimatedCost, 0),
    0
  );
}

export default function Home() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState(1000);
  const [days, setDays] = useState(3);
  const [currency, setCurrency] = useState("USD");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<SavedTrip[]>([]);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setSaved(loadTrips());
  }, []);

  async function generate() {
    setLoading(true);
    setError("");
    setTrip(null);
    setJustSaved(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, budget, days, currency }),
      });
      if (!res.ok) throw new Error();
      setTrip(await res.json());
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!trip) return;
    setSaved(saveTrip(trip));
    setJustSaved(true);
  }

  function openSaved(s: SavedTrip) {
    setTrip(s.trip);
    setJustSaved(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Travel Planner</h1>

      <div className="grid gap-3 sm:grid-cols-4">
        <input className="border rounded p-2 sm:col-span-2" placeholder="Destination"
          value={destination} onChange={(e) => setDestination(e.target.value)} />
        <input className="border rounded p-2" type="number" min={1} max={14} value={days}
          onChange={(e) => setDays(+e.target.value)} />
        <div className="flex gap-2">
          <input className="border rounded p-2 w-full" type="number" value={budget}
            onChange={(e) => setBudget(+e.target.value)} />
          <select className="border rounded p-2" value={currency}
            onChange={(e) => setCurrency(e.target.value)}>
            <option>USD</option><option>INR</option><option>EUR</option>
          </select>
        </div>
      </div>

      <button onClick={generate} disabled={!destination || loading}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
        {loading ? "Planning..." : "Generate trip"}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {trip && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">{trip.destination}</h2>
            <button onClick={handleSave} disabled={justSaved}
              className="rounded border px-3 py-1 disabled:opacity-50">
              {justSaved ? "Saved ✓" : "Save trip"}
            </button>
          </div>
          <p>{trip.summary}</p>
          <p className="font-semibold">
            Estimated total: {tripTotal(trip)} {trip.currency}
          </p>
          {trip.days.map((d) => (
            <section key={d.day} className="border rounded p-4 space-y-2">
              <h3 className="text-xl font-semibold">Day {d.day}: {d.theme}</h3>
              {d.activities.map((a, i) => (
                <p key={i}><b>{a.time}</b> {a.name}: {a.description} ({a.estimatedCost})</p>
              ))}
              {d.restaurants.map((r, i) => (
                <p key={i}>🍽️ <b>{r.mealType}</b> at {r.name} ({r.cuisine}, {r.estimatedCost})</p>
              ))}
            </section>
          ))}
        </div>
      )}

      {saved.length > 0 && (
        <section className="space-y-2 border-t pt-6">
          <h2 className="text-xl font-semibold">Saved trips</h2>
          {saved.map((s) => (
            <div key={s.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <p className="font-medium">
                  {s.trip.destination} · {s.trip.days.length} days
                </p>
                <p className="text-sm opacity-70">
                  {new Date(s.savedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openSaved(s)} className="rounded border px-3 py-1">
                  Open
                </button>
                <button onClick={() => setSaved(deleteTrip(s.id))}
                  className="rounded border px-3 py-1 text-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}