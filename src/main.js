import { HistoryManager, buildCompletionCatalog, getCompletions } from './terminalLogic.js';

const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const terminalHint = document.getElementById('terminal-hint');
const streakLabel = document.getElementById('streak-label');
const streakBonus = document.getElementById('streak-bonus');
const questList = document.getElementById('quest-list');
const addQuestBtn = document.getElementById('add-quest');
const tutorial = document.getElementById('tutorial');
const dismissTutorial = document.getElementById('dismiss-tutorial');
const openHelp = document.getElementById('open-help');
const settingsModal = document.getElementById('settings');
const openSettings = document.getElementById('open-settings');
const closeSettings = document.getElementById('close-settings');
const reduceMotionToggle = document.getElementById('reduce-motion');
const fontSizeToggle = document.getElementById('font-size');
const themeRadios = Array.from(document.querySelectorAll('input[name="theme"]'));

const STORAGE_KEYS = {
  tutorial: 'sq_seen_tutorial',
  streak: 'sq_streak',
  lastPlayed: 'sq_last_played',
  quests: 'sq_quests',
  settings: 'sq_settings',
};

const commands = ['help', 'clear', 'ls', 'cat', 'echo', 'quests', 'streak', 'settings'];
const fileTree = {
  home: {
    readme: 'Welcome to ShellQuest! Complete quests to boost your streak.',
    tips: 'Use tab to autocomplete and up/down to cycle history.',
  },
  quests: {
    daily: 'Defeat procrastination, +50 XP',
    weekly: 'Finish two quests, +100 XP',
  },
};
const catalog = buildCompletionCatalog(commands, fileTree);
const history = new HistoryManager();
let quests = loadQuests();

function focusTrap(modal) {
  const focusable = modal.querySelectorAll('button, input, select, textarea');
  if (!focusable.length) return () => {};
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  return (event) => {
    if (event.key !== 'Tab') return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
}

function loadQuests() {
  const stored = localStorage.getItem(STORAGE_KEYS.quests);
  if (stored) return JSON.parse(stored);
  return [
    { id: 'welcome', title: 'Complete the tutorial overlay', done: false },
    { id: 'streak', title: 'Collect your daily streak bonus', done: false },
    { id: 'hint', title: 'Use tab to see a suggestion', done: false },
  ];
}

function saveQuests() {
  localStorage.setItem(STORAGE_KEYS.quests, JSON.stringify(quests));
}

function renderQuests() {
  questList.innerHTML = '';
  quests.forEach((quest) => {
    const item = document.createElement('li');
    item.className = `quest-item ${quest.done ? 'completed' : ''}`;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = quest.done;
    checkbox.setAttribute('aria-label', `Quest: ${quest.title}`);
    checkbox.addEventListener('change', () => {
      quest.done = checkbox.checked;
      saveQuests();
      renderQuests();
    });
    const title = document.createElement('span');
    title.textContent = quest.title;
    item.append(checkbox, title);
    questList.appendChild(item);
  });
}

function renderLine(text, type = 'normal') {
  const line = document.createElement('div');
  line.className = `terminal-line ${type !== 'normal' ? type : ''}`;
  line.textContent = text;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function showHint(message) {
  terminalHint.textContent = message;
}

function commandHelp() {
  renderLine('Commands:');
  commands.forEach((cmd) => renderLine(`- ${cmd}`));
}

function resolvePath(path) {
  const parts = path.split('/');
  let pointer = fileTree;
  for (const part of parts) {
    if (typeof pointer[part] === 'undefined') return null;
    pointer = pointer[part];
  }
  return pointer;
}

function handleCommand(input) {
  const [cmd, ...rest] = input.trim().split(/\s+/);
  const args = rest.join(' ');
  switch (cmd) {
    case 'help':
      commandHelp();
      showHint('Try: ls home or cat home/readme');
      break;
    case 'clear':
      terminalOutput.innerHTML = '';
      break;
    case 'ls': {
      const path = args || 'home';
      const node = resolvePath(path);
      if (node && typeof node === 'object') {
        renderLine(Object.keys(node).join('  '));
      } else {
        renderLine(`Path not found: ${path}. Try tab-completing paths.`, 'error');
      }
      break;
    }
    case 'cat': {
      const path = args;
      if (!path) {
        renderLine('Usage: cat <path>. Hint: ls to find files.', 'error');
        break;
      }
      const node = resolvePath(path);
      if (typeof node === 'string') {
        renderLine(node);
      } else {
        renderLine(`Cannot read ${path}. Is it a file?`, 'error');
      }
      break;
    }
    case 'echo':
      renderLine(args);
      break;
    case 'quests':
      quests.forEach((q) => renderLine(`${q.done ? '✔' : '•'} ${q.title}`));
      break;
    case 'streak':
      renderLine(streakLabel.textContent);
      renderLine(streakBonus.textContent || 'Keep logging in to grow your streak.');
      break;
    case 'settings':
      openSettingsModal();
      break;
    case '':
      break;
    default:
      renderLine(`Unknown command: ${cmd}. Type help for supported commands.`, 'error');
      showHint('Hint: use Tab for suggestions and ls to explore.');
  }
}

function updateStreak() {
  const today = new Date().toDateString();
  const lastPlayed = localStorage.getItem(STORAGE_KEYS.lastPlayed);
  let streak = Number(localStorage.getItem(STORAGE_KEYS.streak) || 0);
  let bonusMessage = '';
  if (lastPlayed !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastPlayed === yesterday.toDateString()) {
      streak += 1;
      bonusMessage = `Daily bonus! +${10 * streak} XP`;
    } else {
      streak = 1;
      bonusMessage = 'New streak started! +10 XP';
    }
    localStorage.setItem(STORAGE_KEYS.lastPlayed, today);
    localStorage.setItem(STORAGE_KEYS.streak, String(streak));
  }
  streakLabel.textContent = `Streak: ${streak} day${streak === 1 ? '' : 's'}`;
  streakBonus.textContent = bonusMessage;
  quests = quests.map((q) => (q.id === 'streak' && streak > 0 ? { ...q, done: true } : q));
  saveQuests();
  renderQuests();
}

function openModal(modal) {
  modal.hidden = false;
  const trap = focusTrap(modal);
  modal.__trapHandler = trap;
  modal.addEventListener('keydown', trap);
  const focusable = modal.querySelector('button, input');
  focusable?.focus();
  modal.dataset.trap = 'active';
}

function closeModal(modal) {
  modal.hidden = true;
  if (modal.dataset.trap === 'active' && modal.__trapHandler) {
    modal.removeEventListener('keydown', modal.__trapHandler);
    modal.__trapHandler = null;
  }
  terminalInput.focus();
}

function openTutorialIfFirstTime() {
  if (!localStorage.getItem(STORAGE_KEYS.tutorial)) {
    openModal(tutorial);
  }
}

dismissTutorial?.addEventListener('click', () => {
  localStorage.setItem(STORAGE_KEYS.tutorial, 'true');
  closeModal(tutorial);
  quests = quests.map((q) => (q.id === 'welcome' ? { ...q, done: true } : q));
  saveQuests();
  renderQuests();
});

openHelp?.addEventListener('click', () => openModal(tutorial));

function openSettingsModal() {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{}');
  reduceMotionToggle.checked = stored.motion === 'reduced';
  fontSizeToggle.checked = stored.font === 'large';
  themeRadios.forEach((radio) => {
    radio.checked = (stored.theme || 'midnight') === radio.value;
  });
  openModal(settingsModal);
}

function applySettings() {
  const motion = reduceMotionToggle.checked ? 'reduced' : 'full';
  const font = fontSizeToggle.checked ? 'large' : 'normal';
  const theme = themeRadios.find((r) => r.checked)?.value || 'midnight';
  const settings = { motion, font, theme };
  document.documentElement.setAttribute('data-motion', motion === 'reduced' ? 'reduced' : 'full');
  document.documentElement.setAttribute('data-font', font);
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

closeSettings?.addEventListener('click', () => {
  applySettings();
  closeModal(settingsModal);
});

openSettings?.addEventListener('click', openSettingsModal);

addQuestBtn?.addEventListener('click', () => {
  const title = prompt('Add a quest (local only):');
  if (title) {
    quests = [...quests, { id: crypto.randomUUID(), title, done: false }];
    saveQuests();
    renderQuests();
  }
});

function handleInputKeydown(event) {
  if (event.key === 'Enter') {
    const input = terminalInput.value;
    renderLine(`➜ ${input}`);
    history.push(input);
    handleCommand(input);
    terminalInput.value = '';
    showHint('');
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    terminalInput.value = history.previous();
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    terminalInput.value = history.next();
  } else if (event.key === 'Tab') {
    event.preventDefault();
    const result = getCompletions(terminalInput.value, catalog);
    if (result.type === 'complete') {
      terminalInput.value = result.value;
      showHint('');
      quests = quests.map((q) => (q.id === 'hint' ? { ...q, done: true } : q));
      saveQuests();
      renderQuests();
    } else if (result.type === 'suggest') {
      showHint(`Suggestions: ${result.matches.join(', ')}`);
    } else {
      showHint('No matches. Try help to see commands.');
    }
  }
}

function restoreSettings() {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{}');
  if (stored.motion) document.documentElement.setAttribute('data-motion', stored.motion);
  if (stored.font) document.documentElement.setAttribute('data-font', stored.font);
  if (stored.theme) document.documentElement.setAttribute('data-theme', stored.theme);
  reduceMotionToggle.checked = stored.motion === 'reduced';
  fontSizeToggle.checked = stored.font === 'large';
  themeRadios.forEach((radio) => {
    radio.checked = (stored.theme || 'midnight') === radio.value;
  });
}

function ensureContrast() {
  const colors = getComputedStyle(document.documentElement);
  const bg = colors.getPropertyValue('--bg');
  const text = colors.getPropertyValue('--text');
  terminalOutput.style.borderColor = text.trim();
  document.querySelectorAll('.quest-item').forEach((item) => {
    item.style.borderColor = text.trim();
  });
}

function init() {
  renderLine('Type help to begin.');
  terminalInput.addEventListener('keydown', handleInputKeydown);
  terminalInput.setAttribute('aria-live', 'polite');
  terminalInput.focus();
  renderQuests();
  updateStreak();
  restoreSettings();
  openTutorialIfFirstTime();
  ensureContrast();
}

init();
