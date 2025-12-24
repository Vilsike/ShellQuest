export const upgradeCatalog = [
  {
    id: 'xp-boost',
    name: 'XP Booster',
    description: '+10% XP from quests',
    cost: 30,
    apply: (state) => {
      state.upgrades.xpBoost = Math.min(0.5, (state.upgrades.xpBoost || 0) + 0.1);
    },
  },
  {
    id: 'coin-boost',
    name: 'Coin Magnet',
    description: '+10% coins from quests',
    cost: 30,
    apply: (state) => {
      state.upgrades.coinBoost = Math.min(0.5, (state.upgrades.coinBoost || 0) + 0.1);
    },
  },
  {
    id: 'offline-cap',
    name: 'Long Rest',
    description: '+2h offline cap (max 12h)',
    cost: 40,
    apply: (state) => {
      state.upgrades.offlineCapHours = Math.min(12, (state.upgrades.offlineCapHours || 8) + 2);
    },
  },
  {
    id: 'hint-boost',
    name: 'Quick Thinking',
    description: '-5s hint cooldown',
    cost: 25,
    apply: (state) => {
      state.upgrades.hintCooldownReduction = Math.min(20, (state.upgrades.hintCooldownReduction || 0) + 5);
    },
  },
];

export function purchaseUpgrade(state, upgradeId) {
  const upgrade = upgradeCatalog.find((u) => u.id === upgradeId);
  if (!upgrade) return { error: 'Upgrade not found' };
  if (state.player.coins < upgrade.cost) return { error: 'Not enough coins' };
  state.player.coins -= upgrade.cost;
  upgrade.apply(state);
  return { ok: true };
}
