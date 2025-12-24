import { logCommand } from './state.js';
import { banner, tutorialCard } from './ascii.js';
import { quests, zones, zoneUnlocked, isQuestComplete } from './quests.js';

function hasCompletedQuest(state) {
  return Object.values(state.questStatus || {}).some((quest) => quest?.completed);
}

function nextRecommendedQuest(state) {
  for (const zone of zones) {
    if (!zoneUnlocked(state, zone.id)) continue;
    const pending = quests.find((quest) => quest.zone === zone.id && !isQuestComplete(state, quest.id));
    if (pending) return { quest: pending, zone };
  }
  return null;
}

function randomTips(count = 5) {
  const tips = [
    'Type `tutorial` anytime to see your next move.',
    'Use `ls` often to stay oriented.',
    '`pwd` tells you exactly where you are.',
    'Try `cd tutorials` to explore starter files.',
    'Most commands are lowercase. Mind the spaces.',
    'Use `cat <file>` to read story snippets.',
    'Create practice files with `touch filename`.',
    'Clear clutter with `clear` to focus.',
    'Unlock new zones by completing quests.',
    'Pipes like `ls | grep txt` filter output.',
  ];

  const shuffled = [...tips].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function executeCommand(input, fs, state) {
  const trimmed = input.trim();
  if (!trimmed) return { output: [''], command: '' };

  // handle pipeline for grep
  if (trimmed.includes('|')) {
    const [left, right] = trimmed.split('|').map((part) => part.trim());
    if (right.startsWith('grep')) {
      const pattern = right.split(' ').slice(1).join(' ');
      const leftResult = executeCommand(left, fs, state);
      const filtered = leftResult.output.filter((line) => line.includes(pattern));
      const output = filtered.length ? filtered : ['(no matches)'];
      logCommand(state, trimmed, output.join('\n'));
      return { output, command: trimmed };
    }
  }

  const [cmd, ...args] = trimmed.split(' ');
  let output = [];

  switch (cmd) {
    case 'help': {
      if (!hasCompletedQuest(state)) {
        output.push({ type: 'ascii', content: tutorialCard('Welcome to ShellQuest', [
          'Use `tutorial` for your next move.',
          'Start with `pwd`, `ls`, then `cat notes.txt`.',
        ]) });
      }
      output.push('Commands: help, tutorial, tips, banner, clear, pwd, ls, cd, cat, touch, mkdir, rm, echo, grep');
      break;
    }
    case 'clear':
      output = ['__clear__'];
      break;
    case 'pwd': {
      output = [fs.pwd()];
      break;
    }
    case 'ls': {
      const result = fs.ls(args[0] || '');
      output = result.error ? [result.error] : [result.items.join('  ')];
      break;
    }
    case 'banner': {
      output = [{ type: 'ascii', content: banner() }];
      break;
    }
    case 'tutorial': {
      const next = nextRecommendedQuest(state);
      if (!next) {
        output = [{ type: 'ascii', content: tutorialCard('All quests clear!', ['Awaiting new adventures.']) }];
      } else {
        const lines = [
          `Zone: ${next.zone.name}`,
          `Goal: ${next.quest.goal}`,
          `Try: ${next.quest.hints[0]}`,
        ];
        output = [{ type: 'ascii', content: tutorialCard(`Next: ${next.quest.title}`, lines) }];
      }
      break;
    }
    case 'tips': {
      output = [{ type: 'ascii', content: tutorialCard('Quick tips', randomTips()) }];
      break;
    }
    case 'cd': {
      const target = args[0] || '';
      const result = fs.cd(target);
      output = result.error ? [result.error] : [result.path];
      break;
    }
    case 'cat': {
      const target = args[0];
      const result = fs.cat(target);
      output = result.error ? [result.error] : [result.content];
      break;
    }
    case 'touch': {
      const target = args[0];
      if (!target) {
        output = ['Missing filename'];
        break;
      }
      const result = fs.touch(target);
      output = result.error ? [result.error] : [`Created ${target}`];
      break;
    }
    case 'mkdir': {
      const target = args[0];
      if (!target) {
        output = ['Missing directory name'];
        break;
      }
      const result = fs.mkdir(target);
      output = result.error ? [result.error] : [`Created directory ${target}`];
      break;
    }
    case 'rm': {
      const target = args[0];
      if (!target) {
        output = ['Missing target'];
        break;
      }
      const result = fs.rm(target);
      output = result.error ? [result.error] : [`Removed ${target}`];
      break;
    }
    case 'echo': {
      const rest = args.join(' ');
      const redirectIndex = rest.lastIndexOf('>');
      if (redirectIndex === -1) {
        output = ['Usage: echo "text" > file'];
        break;
      }
      const content = rest.slice(0, redirectIndex).trim().replace(/^"|"$/g, '');
      const target = rest.slice(redirectIndex + 1).trim();
      if (!target) {
        output = ['Missing target file'];
        break;
      }
      const result = fs.echo(content, target);
      output = result.error ? [result.error] : [content];
      break;
    }
    case 'grep': {
      const pattern = args[0];
      const target = args[1];
      if (!pattern || !target) {
        output = ['Usage: grep pattern file'];
        break;
      }
      const result = fs.grep(pattern, target);
      output = result.error ? [result.error] : result.matches.length ? result.matches : ['(no matches)'];
      break;
    }
    default:
      output = [`Unknown command: ${cmd}`];
  }

  const flatOutput = output.map((entry) => (typeof entry === 'string' ? entry : entry.content));
  logCommand(state, trimmed, flatOutput.join('\n'));
  return { output, command: trimmed };
}
