import { getStorage } from './storage.js';

const STORAGE_KEY = 'shellquest-state-v0.2';

export const defaultState = {
  player: {
    level: 1,
    xp: 0,
    coins: 0,
    skills: {
      navigation: 0,
      files: 0,
      text: 0,
    },
  },
  upgrades: {
    xpBoost: 0,
    coinBoost: 0,
    offlineCapHours: 8,
    hintCooldownReduction: 0,
  },
  questStatus: {},
  zoneUnlockNotified: {},
  stats: {
    completedQuestsByZone: {},
    commandLog: [],
  },
  lastActive: Date.now(),
  streak: {
    lastCheck: Date.now(),
    days: 0,
  },
};

export function loadState() {
  const storage = getStorage();
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    return structuredClone(defaultState);
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      player: { ...structuredClone(defaultState.player), ...parsed.player },
      upgrades: { ...structuredClone(defaultState.upgrades), ...parsed.upgrades },
      stats: { ...structuredClone(defaultState.stats), ...parsed.stats },
      questStatus: parsed.questStatus || {},
      streak: { ...structuredClone(defaultState.streak), ...parsed.streak },
    };
  } catch (err) {
    console.warn('Failed to parse saved state', err);
    return structuredClone(defaultState);
  }
}

export function saveState(state) {
  const storage = getStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function applyRewards(state, rewards) {
  const xpMultiplier = 1 + (state.upgrades?.xpBoost || 0);
  const coinMultiplier = 1 + (state.upgrades?.coinBoost || 0);
  const xpGain = Math.round((rewards.xp || 0) * xpMultiplier);
  const coinGain = Math.round((rewards.coins || 0) * coinMultiplier);

  state.player.xp += xpGain;
  state.player.coins += coinGain;

  if (rewards.skill) {
    const skillKey = rewards.skill;
    state.player.skills[skillKey] = (state.player.skills[skillKey] || 0) + Math.ceil(xpGain * 0.6);
  }
  state.player.skills.navigation ||= 0;
  state.player.skills.files ||= 0;
  state.player.skills.text ||= 0;
  levelCheck(state);
}

export function levelCheck(state) {
  let required = xpForNextLevel(state.player.level);
  while (state.player.xp >= required) {
    state.player.xp -= required;
    state.player.level += 1;
    required = xpForNextLevel(state.player.level);
  }
}

export function xpForNextLevel(level) {
  return 50 + (level - 1) * 25;
}

export function logCommand(state, command, output) {
  state.stats.commandLog.push({ command, output, at: Date.now() });
  if (state.stats.commandLog.length > 200) {
    state.stats.commandLog.shift();
  }
}

export function updateQuestProgress(state, questId, zoneId) {
  if (!state.stats.completedQuestsByZone[zoneId]) {
    state.stats.completedQuestsByZone[zoneId] = 0;
  }
  if (!state.questStatus[questId]) {
    state.stats.completedQuestsByZone[zoneId] += 1;
  }
  state.questStatus[questId] = { completed: true, completedAt: Date.now() };
}

export function resetStateForTests() {
  return structuredClone(defaultState);
}
