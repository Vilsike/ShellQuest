const USERNAME_REGEX = /^[A-Za-z0-9_]{3,16}$/;

export function normalizeUsername(username) {
  return typeof username === 'string' ? username.trim().toLowerCase() : '';
}

export function validateUsername(username) {
  if (!username || typeof username !== 'string') return false;
  return USERNAME_REGEX.test(username.trim());
}
