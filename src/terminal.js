import { logCommand, defaultState } from './state.js';
import { validateUsername, normalizeUsername } from './validators.js';
import { createCloudProfile, fetchCloudProfile, usernameTaken } from './auth.js';
import { isSupabaseConfigured } from './supabaseClient.js';
import { loadAccountState, storeAccountState } from './storage.js';
import { pullLatestState, flushPendingSync, syncStatus } from './sync.js';

const CLOUD_BADGE = [
  '==========================',
  '  CLOUD SAVE ENABLED ☁️ ',
  '==========================',
];

function accountKey(account) {
  if (!account || (account.mode === 'local' && !account.username)) return 'local:guest';
  if (account.mode === 'cloud') {
    return `cloud:${account.profileId || normalizeUsername(account.username || '')}`;
  }
  return `local:${normalizeUsername(account.username)}`;
}

function applyState(target, source) {
  const clean = structuredClone(source);
  Object.keys(target).forEach((key) => delete target[key]);
  Object.assign(target, clean);
}

function persistSnapshot(account, state) {
  const key = accountKey(account);
  storeAccountState(key, state);
}

function ensureAccountMetadata(state, account) {
  state.account = {
    username: account.username ?? null,
    profileId: account.profileId ?? null,
    mode: account.mode || 'local',
  };
}

function signupBadge() {
  return [...CLOUD_BADGE];
}

async function handleSignup(username, state) {
  if (!validateUsername(username)) {
    return ['Invalid username. Use 3-16 letters, numbers, or underscores.'];
  }
  const normalized = normalizeUsername(username);
  persistSnapshot(state.account, state);

  if (isSupabaseConfigured()) {
    try {
      const profile = await createCloudProfile(normalized);
      ensureAccountMetadata(state, { username: profile.username, profileId: profile.id, mode: 'cloud' });
      return ['Signup successful. Cloud profile created.', ...signupBadge()];
    } catch (error) {
      if (usernameTaken(error)) {
        return ['Username taken. Try another.'];
      }
      return [error.message || 'Could not create profile.'];
    }
  }

  const cacheKey = accountKey({ mode: 'local', username: normalized });
  if (loadAccountState(cacheKey)) {
    return ['Username taken. Try another.'];
  }
  ensureAccountMetadata(state, { username: normalized, profileId: `local-${normalized}`, mode: 'local' });
  persistSnapshot(state.account, state);
  return ['Local profile created (offline mode).'];
}

async function handleLogin(username, state) {
  if (!validateUsername(username)) {
    return ['Invalid username. Use 3-16 letters, numbers, or underscores.'];
  }
  const normalized = normalizeUsername(username);
  persistSnapshot(state.account, state);

  if (isSupabaseConfigured()) {
    try {
      const profile = await fetchCloudProfile(normalized);
      if (!profile) {
        return ['No profile found. Use signup <username>.'];
      }
      const cacheKey = accountKey({ mode: 'cloud', profileId: profile.id, username: profile.username });
      const cached = loadAccountState(cacheKey) || structuredClone(defaultState);
      ensureAccountMetadata(cached, { username: profile.username, profileId: profile.id, mode: 'cloud' });
      const merged = await pullLatestState(cached, cached.account);
      const nextState = { ...merged.save, account: cached.account };
      applyState(state, nextState);
      persistSnapshot(state.account, state);
      return ['Logged in from cloud saves.', ...signupBadge()];
    } catch (error) {
      return [error.message || 'Could not log in.'];
    }
  }

  const cacheKey = accountKey({ mode: 'local', username: normalized });
  const cached = loadAccountState(cacheKey) || structuredClone(defaultState);
  ensureAccountMetadata(cached, { username: normalized, profileId: `local-${normalized}`, mode: 'local' });
  applyState(state, cached);
  persistSnapshot(state.account, state);
  return ['Local login ready.'];
}

function handleLogout(state) {
  persistSnapshot(state.account, state);
  const guest = loadAccountState('local:guest') || structuredClone(defaultState);
  ensureAccountMetadata(guest, { username: null, profileId: null, mode: 'local' });
  applyState(state, guest);
  persistSnapshot(state.account, state);
  return ['Logged out. Back to local mode.'];
}

function handleWhoAmI(state) {
  if (state.account?.username) {
    const modeLabel = state.account.mode === 'cloud' ? 'cloud' : 'local';
    return [`${state.account.username} (${modeLabel})`];
  }
  return ['Not logged in.'];
}

async function handleSync(state) {
  if (state.account?.mode !== 'cloud') {
    return ['Local mode only. Nothing to sync.'];
  }
  if (!isSupabaseConfigured()) {
    return ['Supabase not configured.'];
  }

  const merged = await pullLatestState(state, state.account);
  applyState(state, { ...merged.save, account: state.account });
  const flush = await flushPendingSync(state);
  const status = flush.status === 'synced' ? 'Cloud save updated.' : syncStatus();
  return [`Sync complete (${merged.applied}). ${status}`];
}

export async function executeCommand(input, fs, state) {
  const trimmed = input.trim();
  if (!trimmed) return { output: [''], command: '' };

  // handle pipeline for grep
  if (trimmed.includes('|')) {
    const [left, right] = trimmed.split('|').map((part) => part.trim());
    if (right.startsWith('grep')) {
      const pattern = right.split(' ').slice(1).join(' ');
      const leftResult = await executeCommand(left, fs, state);
      const filtered = leftResult.output.filter((line) => line.includes(pattern));
      const output = filtered.length ? filtered : ['(no matches)'];
      logCommand(state, trimmed, output.join('\n'));
      return { output, command: trimmed };
    }
  }

  const [cmd, ...args] = trimmed.split(' ');
  let output = [];

  switch (cmd) {
    case 'help':
      output = [
        'Commands: help, clear, pwd, ls, cd, cat, touch, mkdir, rm, echo, grep, signup, login, logout, whoami, sync',
      ];
      break;
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
    case 'signup': {
      const username = args[0];
      if (!username) {
        output = ['Usage: signup <username>'];
        break;
      }
      output = await handleSignup(username, state);
      break;
    }
    case 'login': {
      const username = args[0];
      if (!username) {
        output = ['Usage: login <username>'];
        break;
      }
      output = await handleLogin(username, state);
      break;
    }
    case 'logout':
      output = handleLogout(state);
      break;
    case 'whoami':
      output = handleWhoAmI(state);
      break;
    case 'sync':
      output = await handleSync(state);
      break;
    default:
      output = [`Unknown command: ${cmd}`];
  }

  logCommand(state, trimmed, output.join('\n'));
  return { output, command: trimmed };
}
