import React from 'react';
import { Quest, Zone } from '../data/quests';

interface ZoneCardProps {
  zone: Zone;
  progress: number;
  recommended?: Quest;
  mastered: boolean;
  onSelect: (zoneId: number) => void;
}

const ZoneCard: React.FC<ZoneCardProps> = ({ zone, progress, recommended, mastered, onSelect }) => {
  return (
    <article className="zone-card" onClick={() => onSelect(zone.id)}>
      <header className="zone-card__header">
        <div>
          <p className="zone-card__eyebrow">Zone {zone.id}</p>
          <h2>{zone.name}</h2>
          <p className="zone-card__theme">{zone.theme}</p>
        </div>
        {mastered && <span className="badge">Mastery</span>}
      </header>
      <div className="zone-card__progress">
        <div className="zone-card__progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="zone-card__meta">{progress}% complete</p>
      {recommended && (
        <div className="zone-card__recommended">
          <p className="zone-card__eyebrow">Recommended next</p>
          <p className="zone-card__recommendation">{recommended.title}</p>
        </div>
      )}
    </article>
  );
};

export default ZoneCard;
