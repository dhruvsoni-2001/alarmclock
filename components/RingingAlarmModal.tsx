"use client";

import React, { useState, useEffect } from 'react';
import { Alarm } from '@/types';
import { speak } from '@/lib/speech'; // <-- IMPORT THE REAL FUNCTION

// Assuming you will create this lib file for Gemini later
const callGemini = async (prompt: string) => { 
    console.log("Calling Gemini with prompt:", prompt);
    // Placeholder response for now
    return "You are capable of amazing things. Let's do this!"; 
};


export default function RingingAlarmModal({ alarm, onDismiss }: { alarm: Alarm, onDismiss: () => void }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [motivation, setMotivation] = useState('');

  // This useEffect hook runs once when the modal appears.
    useEffect(() => {
    // If the task is "Padhai karo", this will now be spoken in an Indian voice (if available)
    speak(`Abey, ${alarm.task} ka time ho gaya`); 
  }, [alarm]);

  const handleGetMotivation = async () => {
    setIsGenerating(true);
    const prompt = `Generate a short, powerful, and unique motivational quote related to the task: "${alarm.task}". Make it sound like a personal reminder.`;
    const message = await callGemini(prompt);
    setMotivation(message);
    speak(message); // Also speak the motivational message
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-teal-500 to-indigo-600 rounded-lg p-1 shadow-2xl animate-pulse-slow">
        <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md text-center">
          <p className="text-6xl font-mono animate-bounce">{alarm.time}</p>
          <h3 className="text-2xl font-bold mt-4 mb-2 text-white">{alarm.task}</h3>
          
          {motivation && <p className="text-indigo-200 mt-4 italic">"{motivation}"</p>}

          <div className="mt-8 flex flex-col space-y-4">
            <button onClick={handleGetMotivation} disabled={isGenerating} className="w-full py-3 px-6 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors font-semibold text-lg disabled:bg-indigo-400 disabled:cursor-wait">
              {isGenerating ? 'Thinking...' : '✨ Get a Motivational Boost'}
            </button>
            <button onClick={onDismiss} className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors font-semibold text-lg">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
