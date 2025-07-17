"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import {
  TextField,
  Button,
  Stack,
  Switch,
  FormControlLabel,
  CircularProgress,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useStore } from "@/lib/useStore";
import { Alarm } from "@/types";

// 🌚 Dark theme for MUI
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2dd4bf",
    },
  },
});

// 💎 Glass style override
const glassInputStyle = {
  "& .MuiInputBase-root": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "1px solid rgba(255, 255, 255, 0.4)",
  },
};

export default function EditAlarmPage() {
  const router = useRouter();
  const params = useParams();
  const alarmId = Number(params.id);

  const { alarms, updateAlarm } = useStore();
  const [alarmToEdit, setAlarmToEdit] = useState<Alarm | undefined>(undefined);

  const [time, setTime] = useState<Dayjs | null>(null);
  const [task, setTask] = useState("");
  const [days, setDays] = useState<Record<number, boolean>>({});
  const [isRepeating, setIsRepeating] = useState(true);
  const [date, setDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    const found = alarms.find((a) => a.id === alarmId);
    setAlarmToEdit(found);
    if (found) {
      setTime(dayjs(found.time, "HH:mm"));
      setTask(found.task);
      setIsRepeating(!found.isOneTime);
      setDays(found.days || {});
      if (found.oneTimeDate) {
        setDate(dayjs(found.oneTimeDate));
      }
    }
  }, [alarmId, alarms]);

  const toggleDay = (d: number) =>
    setDays((prev) => ({ ...prev, [d]: !prev[d] }));

  const handleSave = () => {
    if (
      !time ||
      !task ||
      (isRepeating && Object.values(days).every((d) => !d)) ||
      (!isRepeating && !date)
    ) {
      alert("Please fill all required fields.");
      return;
    }

    updateAlarm(alarmId, {
      time: time.format("HH:mm"),
      task: task,
      days: isRepeating ? days : {},
      isOneTime: !isRepeating,
      oneTimeDate: !isRepeating && date ? date.toISOString() : null,
    });

    router.push("/");
  };

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  if (!alarmToEdit) {
    return (
      <ThemeProvider theme={darkTheme}>
        <div className="flex items-center justify-center h-screen bg-neutral-900">
          <Stack spacing={2} alignItems="center">
            <CircularProgress />
            <Typography>Loading Alarm...</Typography>
          </Stack>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex justify-center items-center min-h-screen p-4 bg-neutral-900">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md">
            <Stack spacing={3}>
              <h1 className="text-2xl font-bold text-center text-white mb-2">
                Edit Alarm
              </h1>

              <TimePicker
                label="Time"
                value={time}
                onChange={setTime}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    sx: glassInputStyle,
                  },
                }}
              />

              <TextField
                label="Label / Task"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                sx={glassInputStyle}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={isRepeating}
                    onChange={(e) => setIsRepeating(e.target.checked)}
                  />
                }
                label="Repeat Weekly"
                sx={{ justifyContent: "center" }}
              />

              {isRepeating ? (
                <div className="flex justify-center space-x-1 py-1">
                  {dayLabels.map((label, i) => (
                    <Button
                      key={i}
                      size="small"
                      variant={days[i] ? "contained" : "outlined"}
                      onClick={() => toggleDay(i)}
                      sx={{ minWidth: 38, height: 38, p: 0 }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              ) : (
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={setDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      sx: glassInputStyle,
                    },
                  }}
                />
              )}

              <Button
                variant="contained"
                onClick={handleSave}
                disabled={!task}
                sx={{ py: 1.5, fontSize: "1rem" }}
              >
                Save Changes
              </Button>
            </Stack>
          </div>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
