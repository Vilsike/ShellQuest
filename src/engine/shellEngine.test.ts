import { describe, expect, it, beforeEach } from 'vitest';
import { ShellEngine } from './shellEngine';
import { zones, totalQuestCount } from '../data/quests';

describe('ShellEngine zone 3 commands', () => {
  let engine: ShellEngine;

  beforeEach(() => {
    engine = new ShellEngine();
  });

  it('handles export by setting environment variables', () => {
    const first = engine.run('export CODE_NAME=nebula');
    expect(first.output).toContain('added');

    const second = engine.run('export CODE_NAME=aurora');
    expect(second.output).toContain('updated');

    const env = engine.run('env');
    expect(env.output).toContain('CODE_NAME=aurora');
  });

  it('kills an existing process safely', () => {
    const before = engine.run('ps');
    expect(before.output).toContain('log-watcher');

    const killed = engine.run('kill 202');
    expect(killed.status).toBe('ok');
    expect(killed.output).toContain('terminated safely');

    const after = engine.run('ps');
    expect(after.output).not.toContain('log-watcher');
  });
});

describe('ShellEngine zone 4 commands', () => {
  let engine: ShellEngine;

  beforeEach(() => {
    engine = new ShellEngine();
  });

  it('simulates ping with count flag', () => {
    const result = engine.run('ping -c 2 relay');
    expect(result.output.split('\n')[0]).toContain('PING simulation');
    expect(result.output).toContain('2 packets transmitted');
  });

  it('installs packages with apt and retains set', () => {
    const first = engine.run('apt install tracer');
    expect(first.output).toContain('installed tracer');

    const second = engine.run('apt install tracer');
    expect(second.output).toContain('reinstalled tracer');
    expect(second.output).toContain('core-utils');
  });
});

describe('quest data integrity', () => {
  it('keeps exactly 35 quests', () => {
    const count = zones.reduce((sum, zone) => sum + zone.quests.length, 0);
    expect(count).toBe(35);
    expect(count).toBe(totalQuestCount);
  });
});
