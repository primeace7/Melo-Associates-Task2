import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAI, getGenerativeModel, GoogleAIBackend, type GenerativeModel } from 'firebase/ai';

/**
 * Firebase web config. These values are meant to be public (that's how
 * Firebase web apps identify themselves) — see the README for how to fill
 * them in from your own Firebase project.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL?.trim() || 'gemini-3.1-flash-lite';

let cachedApp: FirebaseApp | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!cachedApp) {
    cachedApp = initializeApp(firebaseConfig);
  }
  return cachedApp;
}

/**
 * Creates a fresh Gemini model instance (via Firebase AI Logic) configured
 * with a specific system instruction and JSON-only output. A new lightweight
 * instance is created per call since the system instruction changes based on
 * the selected mode or whether we're escalating a compliment.
 */
export function createJsonModel(systemInstruction: string): GenerativeModel {
  const ai = getAI(getFirebaseApp(), { backend: new GoogleAIBackend() });

  return getGenerativeModel(ai, {
    model: MODEL_NAME,
    systemInstruction,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 1,
    },
  });
}

/** Sends a single text prompt to a JSON-mode model and returns the raw text. */
export async function generateJsonText(model: GenerativeModel, prompt: string): Promise<string> {
  const result = await model.generateContent(prompt);
  return result.response.text();
}
