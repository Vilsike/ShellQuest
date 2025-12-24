import { HistoryManager, buildCompletionCatalog, getCompletions } from '../src/terminalLogic.js';

describe('HistoryManager', () => {
  test('stores and navigates commands', () => {
    const history = new HistoryManager(3);
    history.push('help');
    history.push('ls home');
    history.push('cat home/readme');
    expect(history.previous()).toBe('cat home/readme');
    expect(history.previous()).toBe('ls home');
    expect(history.previous()).toBe('help');
    expect(history.next()).toBe('ls home');
    expect(history.next()).toBe('cat home/readme');
    expect(history.next()).toBe('');
  });

  test('respects limit', () => {
    const history = new HistoryManager(2);
    history.push('a');
    history.push('b');
    history.push('c');
    expect(history.entries).toEqual(['b', 'c']);
  });
});

describe('getCompletions', () => {
  const catalog = buildCompletionCatalog(['help', 'clear', 'cat'], { home: { readme: 'text', tips: 'more' } });

  test('completes single match', () => {
    const result = getCompletions('he', catalog);
    expect(result.type).toBe('complete');
    expect(result.value).toBe('help');
  });

  test('suggests multiple matches', () => {
    const result = getCompletions('c', catalog);
    expect(result.type).toBe('suggest');
    expect(result.matches).toEqual(expect.arrayContaining(['clear', 'cat']));
  });

  test('completes paths on second token', () => {
    const result = getCompletions('cat h', catalog);
    expect(result.type).toBe('suggest');
    expect(result.matches).toEqual(expect.arrayContaining(['home', 'home/readme', 'home/tips']));
  });

  test('no matches returns none', () => {
    const result = getCompletions('unknown', catalog);
    expect(result.type).toBe('none');
    expect(result.matches).toEqual([]);
  });
});
