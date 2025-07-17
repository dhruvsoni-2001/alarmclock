// File: /lib/speech.ts
// Description: An updated utility to find and use a specific voice (like Indian English) for text-to-speech.

// This function will hold the found voice so we don't have to search for it every time.
let selectedVoice: SpeechSynthesisVoice | null = null;

/**
 * Finds and sets the desired voice. It's called once when voices are loaded.
 */
const findAndSetVoice = () => {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    return; // Voices not loaded yet.
  }

  // We are looking for a voice with the language code 'hi-IN' (Hindi - India)
  // or 'en-IN' (English - India). 'hi-IN' is more likely to handle Hindi script well.
  selectedVoice = voices.find(voice => voice.lang === 'hi-IN') || voices.find(voice => voice.lang === 'en-IN') || null;

  if (selectedVoice) {
    console.log(`Found and set Indian voice: ${selectedVoice.name} (${selectedVoice.lang})`);
  } else {
    console.warn("No Indian voice found. Using the browser's default voice.");
  }
};

// The browser loads voices asynchronously. We need to wait for the 'voiceschanged'
// event to fire before we can find the one we want.
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = findAndSetVoice;
}


/**
 * Speaks the given text, attempting to use the selected Indian voice.
 * @param text The text to be spoken.
 */
export const speak = (text: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn("Sorry, your browser does not support text-to-speech.");
    return;
  }

  // Ensure voices have been loaded and our voice has been found.
  if (!selectedVoice && window.speechSynthesis.getVoices().length > 0) {
      findAndSetVoice();
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // If we found our Indian voice, use it!
  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang; // Set the language of the utterance
  }
  
  utterance.pitch = 1;
  utterance.rate = 0.9; // A slightly slower rate can sound more natural
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
};
