import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";

type Alarm = { id: string; time: string; label: string; repeat: string[] };
interface Store {
  alarms: Alarm[];
  addAlarm: (t: string, l: string, r: string[]) => void;
  removeAlarm: (id: string) => void;
}
export const useStore = create<Store>()(
  persist(
    (set) => ({
      alarms: [],
      addAlarm: (time, label, repeat) =>
        set((s) => ({ alarms: [...s.alarms, { id: uuid(), time, label, repeat }] })),
      removeAlarm: (id) => set((s) => ({ alarms: s.alarms.filter((a) => a.id !== id) })),
    }),
    { name: "riseclock-db" }
  )
);