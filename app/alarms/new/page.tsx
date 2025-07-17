"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, Button, Stack, Switch, FormControlLabel, ThemeProvider, createTheme } from "@mui/material";
import { useStore } from "@/lib/useStore";
import { speak } from "@/lib/speech";

// Placeholder for Gemini task suggestion
async function suggestTask(prompt: string) {
    console.log("Suggesting task with prompt:", prompt);
    return "Plan out the top 3 priorities for the day.";
};

// Create a dark theme for Material-UI components to match the glass UI
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2dd4bf', // Teal color for accents
    },
  },
});

export default function NewAlarmPage() {
  const router = useRouter();
  const addAlarm = useStore((s) => s.addAlarm);

  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [time, setTime] = useState<Dayjs | null>(dayjs().add(5, 'minute'));
  const [task, setLabel] = useState("");
  const [days, setDays] = useState<Record<number, boolean>>({});
  const [isRepeating, setIsRepeating] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);

  const toggleDay = (d: number) => setDays((p) => ({ ...p, [d]: !p[d] }));

  const handleSave = () => {
    if (!time || !task || (isRepeating && Object.values(days).every(d => !d)) || (!isRepeating && !date)) {
        console.error("Validation failed: Please fill all required fields.");
        return;
    }

    addAlarm({
        time: time.format('HH:mm'),
        task: task,
        days: isRepeating ? days : {},
        isOneTime: !isRepeating,
        oneTimeDate: !isRepeating && date ? date.toISOString() : null,
    });

    speak(`Alarm set for ${task}`);
    router.push("/");
  };

  const getTaskIdea = async () => {
      setLoadingAI(true);
      const idea = await suggestTask("Suggest a productive morning task");
      setLabel(idea);
      setLoadingAI(false);
  };

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  // Style object for the glass effect on input fields
  const glassInputStyle = {
    '& .MuiInputBase-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: '1px solid rgba(255, 255, 255, 0.4)',
    },
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* This outer div creates a background and centers the glass card */}
        <div className="flex justify-center items-center min-h-screen p-4 bg-neutral-900">
            {/* The main glass card with shadow and rounded corners */}
            <div className="bg-white/4 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md">
                <Stack spacing={3}>
                    <h1 className="text-2xl font-bold text-center text-white mb-2">New Alarm</h1>
                    
                    <TimePicker 
                        label="Time" 
                        value={time} 
                        onChange={setTime} 
                        slotProps={{ textField: { fullWidth: true, variant: "outlined", sx: glassInputStyle } }} 
                    />

                    {/* The TextField is now multiline for a description */}
                    <TextField 
                        id="filled-multiline-flexible" 
                        label="Label / Task" 
                        variant="outlined" 
                        fullWidth 
                        multiline
                        rows={3}
                        value={task} 
                        onChange={(e) => setLabel(e.target.value)}
                        sx={glassInputStyle}
                    />

                    <Button variant="outlined" disabled={loadingAI} onClick={getTaskIdea} sx={{ py: 1.5 }}>
                        {loadingAI ? "Thinking..." : "✨ Suggest Idea"}
                    </Button>

                    <FormControlLabel
                        control={<Switch checked={isRepeating} onChange={(e) => setIsRepeating(e.target.checked)} />}
                        label="Repeat Weekly"
                        sx={{ justifyContent: 'center' }}
                    />

                    {isRepeating ? (
                        <div className="flex justify-center space-x-1 py-1">
                          {dayLabels.map((l, i) => (
                            <Button key={i} size="small" variant={days[i] ? "contained" : "outlined"} onClick={() => toggleDay(i)} sx={{ minWidth: 38, height: 38, p: 0 }}>{l}</Button>
                          ))}
                        </div>
                    ) : (
                        <DatePicker 
                            label="Date" 
                            value={date} 
                            onChange={setDate} 
                            slotProps={{ textField: { fullWidth: true, variant: "outlined", sx: glassInputStyle } }} 
                        />
                    )}

                    <Button variant="contained" onClick={handleSave} disabled={!task} sx={{ py: 1.5, fontSize: '1rem' }}>
                        Save Alarm
                    </Button>
                </Stack>
            </div>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
