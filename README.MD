# ShellQuest

ShellQuest now supports cloud accounts backed by Supabase while remaining a static site (just open `index.html` or serve the folder).

## Features
- Email/password authentication powered by Supabase Auth
- Unique, case-insensitive usernames stored in the `profiles` table
- Cloud-saved progression stored in `progress.save` (JSONB) with last-write-wins merge
- Offline-friendly: localStorage always holds the save; sync happens when online and logged in

## Canonical save shape
The save payload that travels between localStorage and Supabase includes:

```json
{
  "xp": 0,
  "coins": 0,
  "streak": 0,
  "quests": [],
  "upgrades": [],
  "inventory": [],
  "lastDailyClaim": null,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

`updatedAt` is refreshed on every change to support conflict resolution.

## Setting up Supabase
1. Create a new project at [Supabase](https://supabase.com/).
2. From **Project Settings → API**, copy the project URL and anon key.
3. Run the SQL in [`docs/supabase.sql`](./docs/supabase.sql) in the Supabase SQL editor to create tables, the `citext` extension, and RLS policies.
   - The `profiles.username` column is `citext` with a unique constraint, enforcing uniqueness at the database layer.
   - RLS policies restrict reads/writes so users can access only their own `profiles` and `progress` rows.
4. Open `src/config.example.js`, copy it to `src/config.js`, and paste your Supabase URL and anon key:

```js
window.SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
window.SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

> Tip: `config.js` is gitignored so secrets stay out of version control.

## Running locally
- Install dependencies for tests: `npm install`
- Open `index.html` directly in a browser or serve the folder (e.g., `npx serve .`). Everything runs as static files.

## Using accounts
1. In **Settings → Sign up**, create an account (Supabase handles password hashing; nothing is stored in plaintext here).
2. After signing in, if no profile row exists, the **Claim your username** modal appears. Usernames must be 3–16 characters, start with a letter, and may include lowercase letters, numbers, or underscores. Unique constraint + `citext` prevents race conditions and case collisions.
3. Progress automatically syncs after key events (demo quest button) and via **Sync now**. The latest `updatedAt` wins when merging local and cloud saves.
4. Signing out keeps your local save intact for offline play.

## Privacy note
Saved games are stored per account in Supabase. Local saves stay in your browser’s `localStorage` and sync only when authenticated.

## Tests
Run `npm test` to execute Jest unit tests for username validation and merge logic.
