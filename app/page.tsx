"use client";
import { useStore } from "../lib/useStore";

export default function Home() {
  const alarms = useStore((s) => s.alarms);
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Today</h1>
      <section className="space-y-2">
        {alarms.map((a) => (
          <div key={a.id} className="p-3 rounded-xl bg-sky-800/40">
            <span className="text-xl font-mono">{a.time}</span>
            <p className="text-xs opacity-80">{a.label}</p>
          </div>
        ))}
        {alarms.length === 0 && <p>No alarms yet. Add one! ⏰</p>}
      </section>
    </main>
  );
}