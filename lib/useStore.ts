import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Alarm } from '@/types';

interface AlarmState {
  alarms: Alarm[];
  addAlarm: (newAlarm: Omit<Alarm, 'id' | 'enabled'>) => void;
  deleteAlarm: (id: number) => void;
  toggleAlarm: (id: number) => void;
  updateAlarm: (id: number, updateadData: Partial<Omit<Alarm, 'id'>>) => void;
}

export const useStore = create<AlarmState>()(
  persist(
    (set) => ({
      alarms: [
        // Default alarms for first-time users
        { id: 1, time: '07:00', task: 'Wake up and stretch', days: { 1: true, 2: true, 3: true, 4: true, 5: true }, enabled: true, isOneTime: false, oneTimeDate: null },
        { id: 2, time: '09:00', task: 'Team Standup Meeting', days: { 1: true, 2: true, 3: true, 4: true, 5: true }, enabled: true, isOneTime: false, oneTimeDate: null },
      ],
      addAlarm: (newAlarm) =>
        set((state) => ({
          alarms: [...state.alarms, { ...newAlarm, id: Date.now(), enabled: true }],
        })),
      deleteAlarm: (id) =>
        set((state) => ({
          alarms: state.alarms.filter((alarm) => alarm.id !== id),
        })),
      toggleAlarm: (id) =>
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
          ),
        })),
        updateAlarm: (id, updatedData) =>
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, ...updatedData } : alarm
          ),
        })),
    }),
    {
      name: 'alarm-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
    }
  )
);