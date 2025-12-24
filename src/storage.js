export function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  // Fallback in non-browser tests
  const memoryStore = {};
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(memoryStore, key)
        ? memoryStore[key]
        : null;
    },
    setItem(key, value) {
      memoryStore[key] = value;
    },
    removeItem(key) {
      delete memoryStore[key];
    },
  };
}
