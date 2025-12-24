# ShellQuest

A lightweight, single-page shell-inspired experience with quests, streaks, and accessible terminal interactions.

## Features
- Tutorial overlay shown on first launch with keyboard-friendly focus trap.
- Local-only daily streak tracker with bonus message.
- Quest log with persistence and ability to add custom quests.
- Terminal UX improvements: command history, tab completion for commands/paths, contextual hints and clearer errors.
- Settings for reduced motion, larger font size, and two terminal themes (Midnight, Sunrise).
- ARIA labels and contrast touches to keep the terminal usable with assistive tech.

## Running
Open `index.html` in a modern browser. All state is stored locally in `localStorage`.

## Testing
Run unit tests for history navigation and tab completion logic:

```bash
npm test
```
