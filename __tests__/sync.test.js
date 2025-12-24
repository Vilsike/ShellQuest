import { mergeSaves } from '../src/sync.js';

describe('mergeSaves', () => {
  const local = { xp: 5, updatedAt: '2024-01-02T00:00:00.000Z' };
  const cloud = { state: { xp: 10 }, updated_at: '2024-01-03T00:00:00.000Z' };

  it('prefers the newest save', () => {
    const merged = mergeSaves(local, cloud);
    expect(merged.save.xp).toBe(10);
    expect(merged.source).toBe('cloud');
  });

  it('falls back to local when it is newer', () => {
    const newerLocal = { xp: 15, updatedAt: '2024-02-01T00:00:00.000Z' };
    const merged = mergeSaves(newerLocal, cloud);
    expect(merged.save.xp).toBe(15);
    expect(merged.source).toBe('local');
  });

  it('handles missing cloud data', () => {
    const merged = mergeSaves(local, null);
    expect(merged.save.xp).toBe(5);
    expect(merged.source).toBe('local');
  });
});
