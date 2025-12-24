import { getLocalSave, updateLocalSave } from './storage.js';
import { bootstrapSession, signIn, signOut, signUp, loadProfile, claimUsername } from './auth.js';
import { validateUsername } from './validators.js';
import { syncFromCloud, pushSave, markPendingSync, attemptPendingSync, setCurrentUser } from './sync.js';
import { isSupabaseConfigured, supabase } from './supabaseClient.js';

const usernameDisplay = document.getElementById('username-display');
const xpValue = document.getElementById('xp-value');
const coinsValue = document.getElementById('coins-value');
const streakValue = document.getElementById('streak-value');
const authStatus = document.getElementById('auth-status');
const eventStatus = document.getElementById('event-status');
const claimModal = document.getElementById('claim-modal');
const claimStatus = document.getElementById('claim-status');

async function refreshProfileDisplay() {
  if (!isSupabaseConfigured()) {
    usernameDisplay.textContent = 'Guest (Supabase not set)';
    return;
  }
  const profile = await loadProfile();
  if (profile?.username) {
    usernameDisplay.textContent = profile.username;
    claimModal.style.display = 'none';
  } else {
    usernameDisplay.textContent = 'Signed in (no username)';
    claimModal.style.display = 'flex';
  }
}

function renderSave(save) {
  xpValue.textContent = save.xp;
  coinsValue.textContent = save.coins;
  streakValue.textContent = save.streak;
}

function bindDemoEvent() {
  document.getElementById('quest-btn').addEventListener('click', async () => {
    const updated = updateLocalSave((prev) => ({
      ...prev,
      xp: prev.xp + 25,
      coins: prev.coins + 10,
      streak: prev.streak + 1,
      quests: [...prev.quests, { id: Date.now(), reward: 10 }],
    }));
    renderSave(updated);
    eventStatus.textContent = 'Progress saved locally.';
    try {
      await pushSave(updated);
      eventStatus.textContent = 'Progress synced to the cloud!';
    } catch (error) {
      console.warn('Queueing sync', error);
      markPendingSync();
      eventStatus.textContent = 'Offline? We will sync when we can.';
    }
  });
}

function bindAuthForms() {
  document.getElementById('signup-btn').addEventListener('click', async () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    try {
      await signUp(email, password);
      authStatus.textContent = 'Account created. Check your inbox if email confirmation is enabled.';
      await refreshProfileDisplay();
      await syncFromCloud();
    } catch (error) {
      authStatus.textContent = error.message;
    }
  });

  document.getElementById('signin-btn').addEventListener('click', async () => {
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    try {
      await signIn(email, password);
      authStatus.textContent = 'Signed in. Syncing...';
      await refreshProfileDisplay();
      await syncFromCloud();
    } catch (error) {
      authStatus.textContent = error.message;
    }
  });

  document.getElementById('signout-btn').addEventListener('click', async () => {
    await signOut();
    usernameDisplay.textContent = 'Guest';
    authStatus.textContent = 'Signed out. Local progress only.';
    claimModal.style.display = 'none';
    setCurrentUser(null);
  });

  document.getElementById('sync-btn').addEventListener('click', async () => {
    try {
      const result = await syncFromCloud();
      authStatus.textContent = `Sync complete using ${result.applied} save.`;
    } catch (error) {
      authStatus.textContent = error.message;
      markPendingSync();
    }
  });
}

function bindClaim() {
  document.getElementById('claim-btn').addEventListener('click', async () => {
    const username = document.getElementById('claim-username').value;
    if (!validateUsername(username)) {
      claimStatus.textContent = 'Invalid username format.';
      return;
    }
    try {
      await claimUsername(username);
      claimStatus.textContent = 'Username saved!';
      await refreshProfileDisplay();
    } catch (error) {
      if (error?.code === '23505') {
        claimStatus.textContent = 'Username taken. Try another.';
      } else {
        claimStatus.textContent = error.message || 'Could not claim username.';
      }
    }
  });
}

function listenForAuthChanges() {
  if (!isSupabaseConfigured()) return;
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_OUT') {
      usernameDisplay.textContent = 'Guest';
      authStatus.textContent = 'Signed out.';
      claimModal.style.display = 'none';
      setCurrentUser(null);
    }
    if (event === 'SIGNED_IN' && session?.user) {
      setCurrentUser(session.user.id);
      await refreshProfileDisplay();
      await syncFromCloud();
    }
  });
}

async function init() {
  renderSave(getLocalSave());
  bindDemoEvent();
  bindAuthForms();
  bindClaim();
  listenForAuthChanges();

  if (!isSupabaseConfigured()) {
    authStatus.textContent = 'Supabase is not configured. Copy src/config.example.js to src/config.js to enable accounts.';
    return;
  }

  const { session } = await bootstrapSession();
  if (session) {
    await refreshProfileDisplay();
  }
}

window.addEventListener('online', attemptPendingSync);
window.addEventListener('load', init);
