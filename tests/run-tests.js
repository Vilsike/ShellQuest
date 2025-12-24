import assert from 'assert';
import { VirtualFileSystem } from '../src/filesystem.js';
import { executeCommand } from '../src/terminal.js';
import { resetStateForTests, logCommand } from '../src/state.js';
import { quests } from '../src/quests.js';

async function testCdChangesPath() {
  const state = resetStateForTests();
  const fs = new VirtualFileSystem();
  const result = await executeCommand('cd tutorials', fs, state);
  assert.ok(result.output[0].includes('/home/adventurer/tutorials'), 'cd should change cwd to tutorials');
}

async function testGrepMatches() {
  const state = resetStateForTests();
  const fs = new VirtualFileSystem();
  fs.echo('line one\nneedle line\nline three', 'notes.txt');
  const result = await executeCommand('grep needle notes.txt', fs, state);
  assert.deepStrictEqual(result.output, ['needle line'], 'grep should return matching lines');
}

async function testQuestValidation() {
  const state = resetStateForTests();
  const fs = new VirtualFileSystem();
  // simulate mkdir practice
  fs.mkdir('practice');
  logCommand(state, 'mkdir practice', 'Created directory practice');
  const quest = quests.find((q) => q.id === 'plains-mkdir');
  assert.ok(quest.successCriteria({ state, fs }), 'plains-mkdir quest should validate after directory exists');
}

const tests = [
  ['cd changes path', testCdChangesPath],
  ['grep finds matches', testGrepMatches],
  ['quest validation works', testQuestValidation],
];

let passed = 0;
for (const [name, fn] of tests) {
  try {
    await fn();
    passed += 1;
    console.log(`✅ ${name}`);
  } catch (err) {
    console.error(`❌ ${name}`);
    console.error(err);
  }
}

if (passed !== tests.length) {
  process.exit(1);
} else {
  console.log(`All ${passed} tests passed.`);
}
