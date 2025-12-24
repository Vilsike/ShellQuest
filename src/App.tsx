import React, { useMemo, useState } from 'react';
import CommandConsole from './components/CommandConsole';
import QuestList from './components/QuestList';
import ZoneCard from './components/ZoneCard';
import { Quest, Zone, zones, totalQuestCount, masteryAchieved } from './data/quests';
import { ShellEngine } from './engine/shellEngine';

const App: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<Zone>(zones[0]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const engine = useMemo(() => new ShellEngine(), []);

  const toggleQuest = (questId: string) => {
    setCompleted((prev) => {
      const updated = new Set(prev);
      if (updated.has(questId)) {
        updated.delete(questId);
      } else {
        updated.add(questId);
      }
      return updated;
    });
  };

  const progressForZone = (zone: Zone) => {
    const completedCount = zone.quests.filter((quest) => completed.has(quest.id)).length;
    return Math.round((completedCount / zone.quests.length) * 100);
  };

  const recommendedQuest = (zone: Zone): Quest | undefined =>
    zone.quests.find((quest) => !completed.has(quest.id)) ?? zone.quests.find((quest) => quest.challenge);

  const mastered = (zone: Zone) => masteryAchieved(zone, completed);

  const globalProgress = Math.round(
    (completed.size / totalQuestCount) * 100
  );

  return (
    <main className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">ShellQuest</p>
          <h1>Zones 3 & 4: Processes and Networking</h1>
          <p className="lede">35 quests of simulated shell mastery. Track your progress, explore safe commands, and earn mastery badges.</p>
        </div>
        <div className="page__badge">{globalProgress}% complete overall</div>
      </header>

      <section className="zones">
        {zones.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            progress={progressForZone(zone)}
            recommended={recommendedQuest(zone)}
            mastered={mastered(zone)}
            onSelect={(zoneId) => setSelectedZone(zones.find((z) => z.id === zoneId) ?? zones[0])}
          />
        ))}
      </section>

      <section className="content-grid">
        <div>
          <h2>Zone {selectedZone.id}: {selectedZone.name}</h2>
          <p className="lede">{selectedZone.theme}</p>
          <QuestList quests={selectedZone.quests} completed={completed} onToggle={toggleQuest} />
        </div>
        <CommandConsole engine={engine} />
      </section>
    </main>
  );
};

export default App;
