"use client";

import { useStore } from "../lib/useStore";
import Link from 'next/link';
import { Alarm } from "@/types";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

// The AlarmItem sub-component remains the same.
function AlarmItem({ alarm }: { alarm: Alarm }) {
    const { toggleAlarm, deleteAlarm } = useStore();

    const getDaysString = (days: Record<number, boolean>) => {
        if (!days) return 'Once';
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const selectedDays = Object.keys(days).filter(day => days[+day]).map(d => dayNames[+d]);
        if (selectedDays.length === 7) return 'Everyday';
        if (selectedDays.length === 0) return 'Once';
        return selectedDays.join(', ');
    };

    return (
        <div className={`p-4 rounded-xl transition-all ${alarm.enabled ? 'bg-sky-800/60' : 'bg-gray-700/50 opacity-60'}`}>
            <div className="flex justify-between items-center">
                <div>
                    <span className="text-3xl font-mono">{alarm.time}</span>
                    <p className="text-white/90">{alarm.task}</p>
                    <p className="text-xs opacity-70">
                        {alarm.isOneTime && alarm.oneTimeDate ? dayjs(alarm.oneTimeDate).format('MMMM D, YYYY') : getDaysString(alarm.days)}
                    </p>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                    <Link href={`/alarms/edit/${alarm.id}`} passHref>
                      <button className="p-2 text-gray-400 hover:text-sky-400 rounded-full transition-colors" aria-label="Edit Alarm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                        </svg>
                      </button>
                    </Link>
                    <button onClick={() => deleteAlarm(alarm.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors" aria-label="Delete Alarm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={alarm.enabled} onChange={() => toggleAlarm(alarm.id)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default function Home() {
  const alarms = useStore((s) => s.alarms);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    // This outer div ensures the content is centered on the page.
    <div className="flex justify-center w-full px-4">
      
      <main className="w-full max-w-2xl py-8 space-y-6">
        
        {/* The "New Alarm" button has been removed from here. */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Alarms</h1>
        </div>
        
        <section className="space-y-3 min-h-[200px]">
          {isClient ? (
            <>
              {alarms.map((a) => (
                <AlarmItem key={a.id} alarm={a} />
              ))}
              {alarms.length === 0 && <p className="text-center text-white/60 py-8">No alarms yet. Add one! ⏰</p>}
            </>
          ) : (
            <div className="text-center text-white/60 py-8">Loading alarms...</div>
          )}
        </section>
      </main>

      {/* The new floating action button for adding alarms. */}
      <Link href="/alarms/new" passHref>
        <button className="fixed bottom-6 right-6 z-50 bg-teal-500 hover:bg-teal-600 text-white p-4 rounded-full shadow-lg transition duration-300" aria-label="New Alarm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
        </button>
      </Link>
    </div>
  );
}
