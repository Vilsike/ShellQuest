export const STORAGE_KEY = 'shellquest-save';

export function defaultSave() {
  const timestamp = new Date().toISOString();
  return {
    xp: 0,
    coins: 0,
    streak: 0,
    quests: [],
    upgrades: [],
    inventory: [],
    lastDailyClaim: null,
    updatedAt: timestamp,
  };
}

export function getLocalSave() {
  if (typeof localStorage === 'undefined') return defaultSave();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const fresh = defaultSave();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.updatedAt) {
      parsed.updatedAt = new Date().toISOString();
    }
    return parsed;
  } catch (e) {
    console.warn('Could not parse save; resetting', e);
    const fresh = defaultSave();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

export function setLocalSave(save) {
  const payload = { ...save, updatedAt: save.updatedAt || new Date().toISOString() };
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
  return payload;
}

export function updateLocalSave(updater) {
  const current = getLocalSave();
  const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
  next.updatedAt = new Date().toISOString();
  return setLocalSave(next);
}
