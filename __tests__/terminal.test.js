import { VirtualFileSystem } from '../src/filesystem.js';
import { executeCommand } from '../src/terminal.js';
import { resetStateForTests } from '../src/state.js';
import { getStorage } from '../src/storage.js';

function createRuntime() {
  return { state: resetStateForTests(), fs: new VirtualFileSystem() };
}

describe('terminal account commands', () => {
  beforeEach(() => {
    const storage = getStorage();
    storage.clear();
  });

  it('creates a local profile when Supabase is not configured', async () => {
    const { state, fs } = createRuntime();
    const result = await executeCommand('signup Adventurer', fs, state);
    expect(result.output[0]).toContain('Local profile');
    expect(state.account.username).toBe('adventurer');
    expect(state.account.mode).toBe('local');
  });

  it('reports the active user with whoami', async () => {
    const { state, fs } = createRuntime();
    await executeCommand('signup Hero_One', fs, state);
    const whoami = await executeCommand('whoami', fs, state);
    expect(whoami.output[0]).toBe('hero_one (local)');
  });
});
