import React from 'react';
import { Quest } from '../data/quests';

interface QuestListProps {
  quests: Quest[];
  completed: Set<string>;
  onToggle: (questId: string) => void;
}

const QuestList: React.FC<QuestListProps> = ({ quests, completed, onToggle }) => {
  return (
    <div className="quest-list">
      {quests.map((quest) => {
        const done = completed.has(quest.id);
        return (
          <div key={quest.id} className={`quest-card ${done ? 'quest-card--done' : ''}`}>
            <header className="quest-card__header">
              <div>
                <p className="quest-card__eyebrow">{quest.command}</p>
                <h3>{quest.title}</h3>
              </div>
              {quest.challenge && <span className="badge badge--outline">Challenge</span>}
            </header>
            <p className="quest-card__summary">{quest.summary}</p>
            <p className="quest-card__objective">{quest.objective}</p>
            <button className="ghost-button" onClick={() => onToggle(quest.id)}>
              {done ? 'Mark incomplete' : 'Mark complete'}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default QuestList;
