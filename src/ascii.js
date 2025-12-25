const MAX_WIDTH = 44;

function wrapLine(line, width = MAX_WIDTH - 4) {
  if (!line) return [''];
  const segments = [];
  let remaining = line.trim();
  while (remaining.length > width) {
    const slice = remaining.slice(0, width);
    const lastSpace = slice.lastIndexOf(' ');
    const cutoff = lastSpace > 16 ? lastSpace : width;
    segments.push(remaining.slice(0, cutoff).trimEnd());
    remaining = remaining.slice(cutoff).trimStart();
  }
  segments.push(remaining);
  return segments;
}

function boxify(title, items) {
  const lines = [];
  const wrappedTitle = wrapLine(title);
  wrappedTitle.forEach((line) => lines.push(line));
  items.forEach((line) => {
    wrapLine(`• ${line}`).forEach((wrapped) => lines.push(wrapped));
  });

  const contentWidth = Math.min(
    MAX_WIDTH,
    Math.max(18, ...lines.map((l) => l.length + 2))
  );

  const top = `╭${'─'.repeat(contentWidth - 2)}╮`;
  const bottom = `╰${'─'.repeat(contentWidth - 2)}╯`;
  const body = lines.map((line) => `│ ${line.padEnd(contentWidth - 3, ' ')}│`);

  return [top, ...body, bottom].join('\n');
}

export function banner() {
  return [
    '╔══════════════════════╗',
    '║  SHELLQUEST AWAKENS  ║',
    '╚══════════════════════╝',
    '⚡ Learn commands. Earn loot. ⚡',
  ].join('\n');
}

export function tutorialCard(stepTitle, lines = []) {
  return boxify(stepTitle, lines);
}

export function zoneIntro(zoneName) {
  return boxify(`Entering ${zoneName}`, [
    'Scan the area with ls and pwd.',
    'Use tutorial for the next quest.',
  ]);
}

export function questComplete(rewards = {}) {
  const parts = [];
  if (rewards.xp) parts.push(`+${rewards.xp} XP`);
  if (rewards.coins) parts.push(`+${rewards.coins} coins`);
  return boxify('Quest Complete!', [
    parts.join(' · ') || 'Progress logged.',
    'Keep the streak alive.',
  ]);
}

export function cloudEnabled(username = 'Adventurer') {
  return boxify('Cloud Save Enabled', [
    `Welcome, ${username}!`,
    'Progress will sync across devices.',
  ]);
}

// --- Compatibility exports (used by shellquestApp.js) ---
export const onboardingMessage = (typeof onboardingMessage === 'function')
  ? onboardingMessage
  : (typeof getOnboardingMessage === 'function')
    ? getOnboardingMessage
    : () => '';

export const shellquestBanner = (typeof shellquestBanner === 'function')
  ? shellquestBanner
  : (typeof banner === 'function')
    ? banner
    : () => '';
// Compatibility exports expected by shellquestApp.js
export function shellquestBanner() {
  return banner();
}

export function onboardingMessage() {
  return tutorialCard("Welcome to ShellQuest", [
    "Type `help` to see commands.",
    "Try `signup <username>` to create an account.",
    "Complete quests to earn XP + coins and unlock zones.",
  ]);
}
// Compatibility exports expected by shellquestApp.js
export function shellquestBanner() {
  return banner();
}

export function onboardingMessage() {
  return tutorialCard("Welcome to ShellQuest", [
    "Type `help` to see commands.",
    "Try `signup <username>` to create an account.",
    "Complete quests to earn XP + coins and unlock zones.",
  ]);
}
