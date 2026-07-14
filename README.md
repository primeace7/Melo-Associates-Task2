# Compliment Machine 🎉

Type in a job title (like "barista") or describe a person (like "always brings snacks to
meetings"), and get back 3 compliments that are wildly enthusiastic, a little unhinged, and
genuinely funny. Not sure which one is which? There's an "Auto" mode for that too.

Not happy with just "wildly enthusiastic"? Hit **Escalate** on any compliment to make it even
more over the top.

## What's inside

- **React + TypeScript**, built with **Vite**
- **Tailwind CSS** for styling
- **Zod** to validate both what the user types and what the AI sends back
- **Firebase AI Logic** (Gemini) for the actual compliment-writing
- No router — it's a single page, so we kept things simple

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Firebase AI Logic

This app needs a Firebase project with **Firebase AI Logic** turned on so it can talk to
Gemini. It's free to set up and takes about 5 minutes:

1. Go to the [Firebase console](https://console.firebase.google.com/) and create a project
   (or use an existing one).
2. In the left sidebar, open **Build → AI Logic** and follow the setup flow. Pick the
   **Gemini Developer API** option when asked, which is the simplest to get started with.
3. Once that's done, go to **Project settings → General**, scroll to "Your apps", and add a
   **Web app** if you don't already have one. Firebase will show you a config object with
   values like `apiKey`, `authDomain`, etc.
4. Copy `.env.example` to a new file called `.env`:

   ```bash
   cp .env.example .env
   ```

5. Open `.env` and paste in the values from step 3.

That's it — no backend server or API key management needed. Firebase handles the connection
to Gemini for you.

### 3. Run it

```bash
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

### 4. Build for production

```bash
npm run build
```

The output goes into `dist/`, ready to deploy anywhere that serves static files (Firebase
Hosting, Vercel, Netlify, etc).

## How the project is organized

```
src/
  features/
    compliment-generator/     <- everything about generating & escalating compliments
      components/             <- the UI pieces (mode toggle, cards, buttons, ticker...)
      hooks/                  <- useComplimentGenerator.ts, the "brain" of the feature
      prompts/                <- the 3 system prompts live here (see below)
      schemas/                <- zod schemas that validate the AI's JSON responses
      data/                   <- suggested job titles + the loading-screen facts
    help/
      components/             <- the "How to use" button + panel
  lib/
    firebase.ts               <- sets up the connection to Gemini via Firebase AI Logic
    inference.ts              <- calls the model, checks the response, retries if needed
    errors.ts                 <- turns raw errors into kind, readable messages
    clipboard.ts              <- copy-to-clipboard helper
  types/
    compliment.ts             <- shared TypeScript types for the whole feature
```

### About the 3 system prompts

The brief for this app calls for 3 "system prompts" (the instructions that steer the AI). All 3
live in `src/features/compliment-generator/prompts/`:

- **`systemPrompt1.ts`** — used to generate the first 3 compliments. It has three variants
  (Job Title / Describe Someone / Auto) that are picked based on the mode toggle in the UI.
- **`systemPrompt2.ts`** — used when someone hits "Escalate" on a compliment, to make it even
  more over-the-top.
- **`systemPrompt3.ts`** — currently left blank on purpose. It's a placeholder for extra
  instructions that'll get appended to every System Prompt 1 variant in a future update. When
  it's filled in, nothing else needs to change — `systemPrompt1.ts` already appends it
  automatically.

### How a request gets validated

1. What the user types is checked with Zod (at least 3 characters) before anything is sent to
   the AI.
2. The AI is asked to respond with only a JSON object, matching a specific shape.
3. That JSON is checked against a Zod schema (`schemas/complimentSchemas.ts`).
4. If it doesn't match — say the AI added stray text, or left out a required field — we quietly
   ask the model to try again once. If that second attempt also fails, the user sees a friendly
   "please try again" message instead of a broken screen.

### A couple of small UX notes

- The **"Get compliments"** button stays disabled once a result is showing — hit **Clear**
  first if you want to try a different input.
- **Restore** only lights up right after you hit Clear, so you can always get back what you just
  cleared.
- The research facts shown while loading are paraphrased from public reporting on real studies
  and surveys about workplace recognition (Gallup, Harvard Business Review, Oxford's Saïd
  Business School, and a few others) — see `data/loadingFacts.ts` for the full list and sources.

## A note on the Gemini model

By default this uses `gemini-3.1-flash-lite`, set in `.env` via `VITE_GEMINI_MODEL`. It's fast
and inexpensive, which suits short compliment generation well. You can swap in a different
Gemini model at any time by changing that one value — no code changes needed.
