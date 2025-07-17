export interface Alarm {
  id: number;
  time: string; // Stored as "HH:mm"
  task: string;
  days: Record<number, boolean>; // e.g., { 0: true, 1: false, ... } for Sun, Mon
  enabled: boolean;
  isOneTime: boolean; // Flag for alarms that don't repeat
  oneTimeDate: string | null; // ISO string for the specific date of a one-time alarm
}