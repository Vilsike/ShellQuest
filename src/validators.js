const USERNAME_REGEX = /^[a-z][a-z0-9_]{2,15}$/;

export function validateUsername(username) {
  if (!username || typeof username !== 'string') return false;
  return USERNAME_REGEX.test(username.trim());
}
