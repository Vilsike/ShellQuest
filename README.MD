# ShellQuest

A lightweight React + Vite simulator for practicing shell commands across four themed zones. Commands are fully simulated—no real processes or network calls are made.

## Getting started

```bash
npm install
npm run dev
```

## Testing

```bash
npm test
```

## Features

- 35 quests validated with Zod across four zones, including new process and networking challenges.
- Simulated commands for env/export/ps/kill/history plus ping/curl/apt/pacman.
- UI shows zone completion percentage, recommended next quest, and mastery badges when all quests (including a challenge) are completed.
- Mobile-friendly responsive layout.

## Terminal Accounts

ShellQuest now supports profile management directly from the in-game terminal:

- `signup <username>` – create a profile (cloud when Supabase is configured, local otherwise). Usernames are 3-16 letters/numbers/underscores and are case-insensitive.
- `login <username>` – load an existing profile and hydrate your saved state.
- `logout` – return to offline/local mode.
- `whoami` – show the current profile.
- `sync` – manually push/pull cloud saves.

Add Supabase credentials via `.env` or `src/config.js` (see `docs/SUPABASE.md`) to enable cloud saves; otherwise the commands fall back to local storage.
