import React, { useState, useEffect } from 'react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (actionKey: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onAction }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { key: 'play', title: 'Play active game', shortcut: 'Ctrl+Enter' },
    { key: 'install', title: 'Install + (Create new game)', shortcut: 'Ctrl+N' },
    { key: 'settings', title: 'Open Settings', shortcut: 'Ctrl+,' },
    { key: 'support', title: 'Support & Feedback', shortcut: 'F1' },
    { key: 'report', title: 'Report a Problem', shortcut: '' },
    { key: 'open_folder', title: 'Open game data folder in Explorer', shortcut: '' },
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--loam-scrim)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
      }}
      onClick={onClose}
    >
      <div
        className="loam-panel"
        style={{
          width: '540px',
          overflow: 'hidden',
          boxShadow: '0 12px 32px var(--loam-scrim)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--loam-line)' }}>
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              fontSize: '15px',
            }}
          />
        </div>

        <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
          {filtered.map((action) => (
            <button
              key={action.key}
              onClick={() => {
                onAction(action.key);
                onClose();
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'left',
                borderBottom: '1px solid var(--loam-line)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--loam-paper)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{action.title}</span>
              {action.shortcut && (
                <span className="text-secondary text-mono" style={{ fontSize: '11px' }}>
                  {action.shortcut}
                </span>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center' }} className="text-secondary">
              No matching commands.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
