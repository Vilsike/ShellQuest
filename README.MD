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

## Commands

- Gameplay: `help`, `tutorial`, `tips`, `banner`
- Auth & sync: `signup`, `login`, `logout`, `whoami`, `sync`
- Core shell: `clear`, `pwd`, `ls`, `cd`, `cat`, `touch`, `mkdir`, `rm`, `echo`, `grep`

Sample output:

```
$ tutorial
╭────────────────────────────╮
│ Next: Meet the Shell       │
│ • Zone: Terminal Plains    │
│ • Goal: Use the help command. │
│ • Try: Type `help` and press enter. │
╰────────────────────────────╯
```
