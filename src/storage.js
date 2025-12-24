export const STORAGE_KEY = 'shellquest-save';
export const ACCOUNT_CACHE_KEY = 'shellquest-account-cache-v1';

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

function getCacheStore() {
  const storage = getStorage();
  const raw = storage.getItem(ACCOUNT_CACHE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) || {};
  } catch (err) {
    console.warn('Failed to parse account cache', err);
    return {};
  }
}

export function storeAccountState(accountKey, state) {
  if (!accountKey) return;
  const storage = getStorage();
  const cache = getCacheStore();
  cache[accountKey] = structuredClone(state);
  storage.setItem(ACCOUNT_CACHE_KEY, JSON.stringify(cache));
}

export function loadAccountState(accountKey) {
  if (!accountKey) return null;
  const cache = getCacheStore();
  return cache[accountKey] || null;
}

export function clearAccountState(accountKey) {
  if (!accountKey) return;
  const storage = getStorage();
  const cache = getCacheStore();
  delete cache[accountKey];
  storage.setItem(ACCOUNT_CACHE_KEY, JSON.stringify(cache));
}

/**
 * Compatibility export for state.js.
 * Returns a storage-like interface (localStorage if available, otherwise in-memory).
 */
const memoryStorage = (() => {
  if (typeof localStorage !== 'undefined') return null;
  const mem = new Map();
  return {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, String(v)),
    removeItem: (k) => mem.delete(k),
    clear: () => mem.clear(),
    key: (i) => Array.from(mem.keys())[i] ?? null,
    get length() {
      return mem.size;
    },
  };
})();

export function getStorage() {
  if (typeof localStorage !== 'undefined') return localStorage;
  return memoryStorage;
}
