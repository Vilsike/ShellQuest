import { createDefaultFS } from './filesystem.js';
import { executeCommand } from './terminal.js';
import { loadState, saveState, applyRewards, updateQuestProgress, xpForNextLevel } from './state.js';
import { zones, availableQuests, isQuestComplete, zoneUnlocked, quests } from './quests.js';
import { upgradeCatalog, purchaseUpgrade } from './upgrades.js';

const state = loadState();
const fs = createDefaultFS();
let activeZone = 'zone1';
let lastHintTime = 0;
const baseHintCooldown = 20000; // ms

const terminalOutputEl = document.getElementById('terminal-output');
const form = document.getElementById('command-form');
const input = document.getElementById('command-input');
const playerStatsEl = document.getElementById('player-stats');
const questListEl = document.getElementById('quest-list');
const tabsEl = document.getElementById('zone-tabs');
const shopEl = document.getElementById('shop');
const currencyEl = document.getElementById('currency');
const offlineReportEl = document.getElementById('offline-report');
const streakEl = document.getElementById('streak');

function init() {
  renderTabs();
  renderQuests();
  renderShop();
  renderStats();
  checkOfflineGains();
  updateStreak();
  logLine('Type `help` to begin your run.');
}

function renderTabs() {
  tabsEl.innerHTML = '';
  zones.forEach((zone) => {
    const unlocked = zoneUnlocked(state, zone.id);
    const tab = document.createElement('button');
    tab.className = `zone-tab ${activeZone === zone.id ? 'active' : ''} ${unlocked ? '' : 'locked'}`;
    tab.textContent = zone.name;
    tab.title = unlocked ? '' : 'Complete 6 quests in the previous zone to unlock';
    tab.disabled = !unlocked;
    tab.onclick = () => {
      if (unlocked) {
        activeZone = zone.id;
        renderTabs();
        renderQuests();
      }
    };
    tabsEl.appendChild(tab);
  });
}

function skillBar(label, value) {
  const clamped = Math.min(100, value);
  return `<div class="skill-bar"><span>${label} (${value})</span><div class="skill-fill" style="width:${clamped}%"></div></div>`;
}

function renderStats() {
  const xpNeed = xpForNextLevel(state.player.level);
  playerStatsEl.innerHTML = `Lvl ${state.player.level} · XP ${state.player.xp}/${xpNeed} · Coins ${state.player.coins}`;
  currencyEl.textContent = `Coins: ${state.player.coins}`;
  const skills = document.createElement('div');
  skills.className = 'skill-bars';
  skills.innerHTML = [
    skillBar('Navigation', state.player.skills.navigation),
    skillBar('Files', state.player.skills.files),
    skillBar('Text', state.player.skills.text),
  ].join('');
  streakEl.innerHTML = `<strong>Streak:</strong> ${state.streak.days}d`;
  playerStatsEl.appendChild(skills);
}

function renderQuests() {
  questListEl.innerHTML = '';
  const list = availableQuests(state, activeZone);
  list.forEach((quest) => {
    const card = document.createElement('div');
    card.className = 'quest-card';
    const completed = isQuestComplete(state, quest.id);
    const hints = quest.hints.map((hint) => `<li>${hint}</li>`).join('');
    card.innerHTML = `
      <div class="title">${quest.title}</div>
      <div class="goal">${quest.intro} <br/><strong>Goal:</strong> ${quest.goal}</div>
      <div class="meta"><span>XP ${quest.rewards.xp} · Coins ${quest.rewards.coins}</span><span>${quest.zone.toUpperCase()}</span></div>
      <ul>${hints}</ul>
      <div class="actions">
        <button class="hint" data-quest="${quest.id}">Reveal hint</button>
        <button class="complete" ${completed ? 'disabled' : ''}>${completed ? 'Completed' : 'Pending'}</button>
      </div>
    `;
    card.querySelector('.hint').onclick = () => showHint(quest);
    card.querySelector('.complete').onclick = () => {
      if (!completed) {
        checkQuests();
      }
    };
    questListEl.appendChild(card);
  });
}

function renderShop() {
  shopEl.innerHTML = '';
  upgradeCatalog.forEach((upgrade) => {
    const card = document.createElement('div');
    card.className = 'upgrade-card';
    card.innerHTML = `
      <h4>${upgrade.name}</h4>
      <div>${upgrade.description}</div>
      <div>Cost: ${upgrade.cost}c</div>
    `;
    const btn = document.createElement('button');
    btn.textContent = 'Purchase';
    btn.onclick = () => {
      const result = purchaseUpgrade(state, upgrade.id);
      if (result.error) {
        logLine(result.error);
      } else {
        saveState(state);
        renderStats();
        logLine(`Purchased ${upgrade.name}`);
      }
    };
    card.appendChild(btn);
    shopEl.appendChild(card);
  });
}

function showHint(quest) {
  const now = Date.now();
  const cooldown = baseHintCooldown - (state.upgrades.hintCooldownReduction || 0) * 1000;
  if (now - lastHintTime < cooldown) {
    const wait = Math.ceil((cooldown - (now - lastHintTime)) / 1000);
    logLine(`Hints cooling down. Wait ${wait}s.`);
    return;
  }
  lastHintTime = now;
  logLine(`Hint: ${quest.hints[0]}`);
}

function logLine(text, command = '') {
  const line = document.createElement('div');
  line.className = 'output-line';
  const cmdSpan = document.createElement('span');
  cmdSpan.className = 'cmd';
  cmdSpan.textContent = command ? `$ ${command}` : '$';
  const textSpan = document.createElement('span');
  textSpan.className = 'text';
  textSpan.textContent = ` ${text}`;
  if (text === '__clear__') {
    terminalOutputEl.innerHTML = '';
    return;
  }
  line.appendChild(cmdSpan);
  line.appendChild(textSpan);
  terminalOutputEl.appendChild(line);
  terminalOutputEl.scrollTop = terminalOutputEl.scrollHeight;
}

function handleCommand(event) {
  event.preventDefault();
  const value = input.value;
  input.value = '';
  const result = executeCommand(value, fs, state);
  result.output.forEach((text) => logLine(text, result.command));
  checkQuests();
  saveState(state);
}

function checkQuests() {
  quests.forEach((quest) => {
    if (isQuestComplete(state, quest.id)) return;
    if (!zoneUnlocked(state, quest.zone)) return;
    const completed = quest.successCriteria({ state, fs });
    if (completed) {
      applyRewards(state, quest.rewards);
      updateQuestProgress(state, quest.id, quest.zone);
      logLine(`Quest complete: ${quest.title}! +${quest.rewards.xp}xp +${quest.rewards.coins}c`);
      renderStats();
      renderTabs();
      renderQuests();
    }
  });
  saveState(state);
}

function checkOfflineGains() {
  const now = Date.now();
  const elapsed = now - (state.lastActive || now);
  const capMs = (state.upgrades.offlineCapHours || 8) * 60 * 60 * 1000;
  const effective = Math.min(elapsed, capMs);
  const hours = effective / (1000 * 60 * 60);
  const coinGain = Math.floor(hours * 10 * (1 + (state.upgrades.coinBoost || 0)));
  if (coinGain > 0) {
    state.player.coins += coinGain;
    offlineReportEl.classList.remove('hidden');
    offlineReportEl.innerHTML = `Welcome back! You were away for ${(elapsed / (1000 * 60 * 60)).toFixed(2)}h and earned ${coinGain} coins.`;
  }
  state.lastActive = now;
  saveState(state);
}

function updateStreak() {
  const now = Date.now();
  const last = state.streak.lastCheck || now;
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  if (diffDays === 0 && state.streak.days === 0) {
    state.streak.days = 1;
  } else if (diffDays === 1) {
    state.streak.days += 1;
  }
  state.streak.lastCheck = now;
  streakEl.textContent = `Streak: ${state.streak.days} day${state.streak.days === 1 ? '' : 's'}`;
  saveState(state);
}

form.addEventListener('submit', handleCommand);
window.addEventListener('beforeunload', () => {
  state.lastActive = Date.now();
  saveState(state);
});

init();
