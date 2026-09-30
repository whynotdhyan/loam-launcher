import React from 'react';
import { GameInstance } from '../types/launcher';

interface GameSwitcherProps {
  games: GameInstance[];
  activeGameId: string;
  onSelectGame: (id: string) => void;
  onOpenAll: () => void;
}

export const GameSwitcher: React.FC<GameSwitcherProps> = ({
  games,
  activeGameId,
  onSelectGame,
  onOpenAll,
}) => {
  const getMonogram = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayedGames = games.slice(0, 4);
  const overflowCount = Math.max(0, games.length - 4);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {displayedGames.map((game) => {
        const isActive = game.id === activeGameId;
        return (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: 'var(--loam-sunken)',
              borderBottom: isActive ? '2px solid var(--loam-ink)' : '2px solid transparent',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'ui-monospace, monospace',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--loam-ink)',
            }}
            title={game.name}
            aria-label={`Select ${game.name}`}
          >
            {getMonogram(game.name)}
          </button>
        );
      })}

      {overflowCount > 0 && (
        <button
          onClick={onOpenAll}
          style={{
            height: '44px',
            padding: '0 10px',
            backgroundColor: 'var(--loam-sunken)',
            borderRadius: '2px',
            fontFamily: 'ui-monospace, monospace',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--loam-text-2)',
          }}
        >
          +{overflowCount}
        </button>
      )}
    </div>
  );
};
