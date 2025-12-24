import { validateUsername, normalizeUsername } from '../src/validators.js';

describe('validateUsername', () => {
  it('accepts valid usernames', () => {
    expect(validateUsername('player1')).toBe(true);
    expect(validateUsername('hero_123')).toBe(true);
    expect(validateUsername('abc')).toBe(true);
    expect(validateUsername('LONG_Name')).toBe(true);
  });

  it('rejects invalid usernames', () => {
    expect(validateUsername('')).toBe(false);
    expect(validateUsername('1startsWithNumber')).toBe(false);
    expect(validateUsername('ab')).toBe(false);
    expect(validateUsername('toolongusernameoverlimit')).toBe(false);
    expect(validateUsername('bad-char!')).toBe(false);
  });

  it('normalizes usernames to lowercase', () => {
    expect(normalizeUsername('Player_One')).toBe('player_one');
    expect(normalizeUsername('  MIXED123  ')).toBe('mixed123');
  });
});
