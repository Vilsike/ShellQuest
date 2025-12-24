import { validateUsername } from '../src/validators.js';

describe('validateUsername', () => {
  it('accepts valid usernames', () => {
    expect(validateUsername('player1')).toBe(true);
    expect(validateUsername('hero_123')).toBe(true);
    expect(validateUsername('abc')).toBe(true);
    expect(validateUsername('long_name_16')).toBe(true);
  });

  it('rejects invalid usernames', () => {
    expect(validateUsername('')).toBe(false);
    expect(validateUsername('1startsWithNumber')).toBe(false);
    expect(validateUsername('ab')).toBe(false);
    expect(validateUsername('UPPERCASE')).toBe(false);
    expect(validateUsername('toolongusernameoverlimit')).toBe(false);
    expect(validateUsername('bad-char!')).toBe(false);
  });
});
