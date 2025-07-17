// File: /components/AlarmEngine.tsx

"use client";

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/useStore';
import RingingAlarmModal from './RingingAlarmModal';
import dayjs from 'dayjs';

export default function AlarmEngine() {
  const alarms = useStore((s) => s.alarms);
  const toggleAlarm = useStore((s) => s.toggleAlarm);
  const [ringingAlarm, setRingingAlarm] = useState(null);
  
  // --- FIX START ---
  // Add a state to track alarms that have rung, to prevent re-triggering.
  // The value will be the time string "HH:mm" when it last rang.
  const [recentlyRung, setRecentlyRung] = useState<Record<number, string>>({});
  // --- FIX END ---

  useEffect(() => {
    const checkAlarms = () => {
      if (ringingAlarm) return;

      const now = dayjs();
      const currentDay = now.day();
      const currentTimeStr = now.format('HH:mm');
      
      const triggeredAlarm = alarms.find(alarm => {
        if (!alarm.enabled) return false;
        if (alarm.time !== currentTimeStr) return false;

        // --- FIX START ---
        // If this alarm has already rung during this minute, skip it.
        if (recentlyRung[alarm.id] === currentTimeStr) {
            return false;
        }
        // --- FIX END ---

        if (alarm.isOneTime) {
          return alarm.oneTimeDate ? now.isSame(dayjs(alarm.oneTimeDate), 'day') : false;
        }

        const repeatsOnToday = alarm.days[currentDay];
        const isRepeating = Object.values(alarm.days).some(day => day === true);
        return isRepeating && repeatsOnToday;
      });

      if (triggeredAlarm) {
        // --- FIX START ---
        // Record that this alarm has now rung at the current time.
        setRecentlyRung(prev => ({ ...prev, [triggeredAlarm.id]: currentTimeStr }));
        // --- FIX END ---
        
        setRingingAlarm(triggeredAlarm);
        if (triggeredAlarm.isOneTime) {
            toggleAlarm(triggeredAlarm.id);
        }
      }
    };

    const intervalId = setInterval(checkAlarms, 5000); 
    return () => clearInterval(intervalId);
  }, [alarms, ringingAlarm, toggleAlarm, recentlyRung]); // Add recentlyRung to dependency array

  const handleDismiss = () => {
    if (ringingAlarm && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
    }
    setRingingAlarm(null);
  };

  return ringingAlarm ? <RingingAlarmModal alarm={ringingAlarm} onDismiss={handleDismiss} /> : null;
}