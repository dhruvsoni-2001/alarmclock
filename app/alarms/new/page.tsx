"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { TextField, Button, Stack } from "@mui/material";
import { useStore } from "@/lib/useStore";

// ——— helpers ————————————————————————————————————————————
const speak = (text: string) => {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
};

async function suggestTask(prompt: string) {
  const apiKey = ""; // <-- add env var later
  if (!apiKey) return "";
  const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
  );
  if (!res.ok) return "";
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().replace(/["']/g, "") || "";
}
// ————————————————————————————————————————————————

export default function NewAlarmPage() {
  const router = useRouter();
  const addAlarm = useStore((s) => s.addAlarm);

  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [time, setTime] = useState<Dayjs | null>(dayjs());
  const [label, setLabel] = useState("");
  const [days, setDays] = useState<Record<number, boolean>>({});
  const [loadingAI, setLoadingAI] = useState(false);

  const toggleDay = (d: number) => setDays((p) => ({ ...p, [d]: !p[d] }));

  const handleSave = () => {
    if (!date || !time || !label) return;

    // combine date & time
    const when = date.hour(time.hour()).minute(time.minute()).second(0);
    addAlarm(when.toISOString(), label, Object.keys(days).filter((k) => days[+k]));

    speak(`Alarm set for ${label} at ${when.format("hh:mm A")} on ${when.format("MMMM D")}`);
    router.push("/"); // back to home or /alarms list
  };

  const getTaskIdea = async () => {
    setLoadingAI(true);
    const idea = await suggestTask(`Suggest a short motivating task for an alarm at ${time?.format("hh:mm A")}`);
    if (idea) setLabel(idea);
    setLoadingAI(false);
  };

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="p-4 space-y-4 max-w-sm mx-auto">
      <h1 className="text-xl font-bold text-center">New Alarm</h1>

      <Stack spacing={2}>
        <DatePicker
          label="Date"
          value={date}
          onChange={(v) => setDate(v)}
          slotProps={{ textField: { fullWidth: true, variant: "filled" } }}
        />

        <TimePicker
          label="Time"
          value={time}
          onChange={(v) => setTime(v)}
          ampm
          slotProps={{ textField: { fullWidth: true, variant: "filled" } }}
        />

        <TextField
          label="Label / Task"
          variant="filled"
          fullWidth
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <Button variant="outlined" disabled={loadingAI} onClick={getTaskIdea}>
          {loadingAI ? "Thinking..." : "✨ Suggest Idea"}
        </Button>

        <div className="flex justify-center space-x-1 py-2">
          {dayLabels.map((l, i) => (
            <Button
              key={i}
              size="small"
              variant={days[i] ? "contained" : "outlined"}
              onClick={() => toggleDay(i)}
              sx={{ minWidth: 36, p: 0 }}
            >
              {l}
            </Button>
          ))}
        </div>

        <Button variant="contained" onClick={handleSave} disabled={!label}>
          Save & Speak
        </Button>
      </Stack>
    </div>
  );
}
