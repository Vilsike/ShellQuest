# ShellQuest v0.2

ShellQuest is a static single-page terminal adventure. Serve `index.html` to play; no build tools are required.

## Zones & progression
- Zones: **Terminal Plains**, **Filewood Forest**, **Grep Caves**.
- Unlock rules: clear 6 quests in the current zone to unlock the next (Zone 2 unlocks after 6 Zone 1 quests, Zone 3 after 6 Zone 2 quests).
- Each zone has its own quest list in the Zones & Quests panel.

## Quests
- 25 quests in total: 8 / 9 / 8 across the three zones.
- Each quest defines `id`, `title`, `zone`, `intro`, `goal`, `hints[]`, `successCriteria(context)`, and `rewards { xp, coins, skill }`.
- Success criteria are evaluated on each command; completed quests automatically grant rewards and mark progress.

## Player progression
- Player stats: level, XP, coins, and skill tracks (Navigation, Files, Text).
- XP required for next level: `50 + 25 * (level - 1)`.
- Quest rewards apply XP and coins with upgrade multipliers; skill XP is fed to the quest’s primary skill.

## Upgrade shop
- Upgrades spend coins and persist in `localStorage`:
  - **XP Booster** (+10% XP up to +50%)
  - **Coin Magnet** (+10% coins up to +50%)
  - **Long Rest** (+2h offline cap up to 12h)
  - **Quick Thinking** (-5s hint cooldown)

## Offline gains
- Coins accrue while away: `10 coins/hour * (1 + coin boost)` capped by the offline cap (default 8h, up to 12h with upgrades).
- A welcome-back card shows time away and rewards when you return.

## Adding quests or zones
- Add zones in `src/quests.js` (`zones` array). Each zone can define an unlock `requirement(state)`.
- Add quests to the `quests` array with the required properties and a `successCriteria({ state, fs })` function that returns true when complete.
- Use the virtual filesystem (`filesystem.js`) or command history (`state.stats.commandLog`) inside success checks to validate behaviors.
- Keep the total quest count and unlock requirements aligned with your content.

## Running & testing
- Open `index.html` in a browser to play.
- Tests are Node-based: run `npm test` (or `node tests/run-tests.js`) to validate quest rules and command behaviors.
