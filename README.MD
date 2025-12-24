# ShellQuest

<<<<<<< HEAD
## Badges
[![CI](https://github.com/<OWNER>/ShellQuest/actions/workflows/ci.yml/badge.svg)](https://github.com/<OWNER>/ShellQuest/actions/workflows/ci.yml)

## Continuous Integration
This project is validated by a GitHub Actions workflow that runs on every push and pull request. The pipeline installs dependencies with npm, runs linting, executes unit tests, builds the app, installs Playwright browsers, and finishes with the end-to-end test suite.

## Codex autofix (optional)
A companion workflow can propose fixes automatically when the CI workflow fails:

1. Add an `OPENAI_API_KEY` secret under **Settings > Secrets and variables > Actions** so the Codex action can reach the OpenAI API.
2. When the `CI` workflow fails, the `Codex Autofix` workflow will attempt to craft a minimal pull request using `openai/codex-action@main` and open it via the `peter-evans/create-pull-request` action.
3. If you do not want automatic proposals, disable the `Codex Autofix` workflow in the Actions tab or delete `.github/workflows/codex-autofix.yml`.
=======
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
- Terminal output preserves ASCII alignment with monospace formatting—run `banner` to replay the ShellQuest introduction.
>>>>>>> origin/main
