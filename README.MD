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

## Contributing / CI

- Use `npm ci` for clean installs to match CI.
- Run `npm test` and `npm run build` before pushing changes.
- Format code with `npm run format` (Prettier) to keep diffs consistent.
- GitHub Actions runs install, lint (if configured), test, and build on pushes and pull requests to `main`.

## Features

- 35 quests validated with Zod across four zones, including new process and networking challenges.
- Simulated commands for env/export/ps/kill/history plus ping/curl/apt/pacman.
- UI shows zone completion percentage, recommended next quest, and mastery badges when all quests (including a challenge) are completed.
- Mobile-friendly responsive layout.
