import React from 'react';
import { PlayState } from '../types/launcher';

interface PlayControlProps {
  state: PlayState;
  progressPercent?: number;
  subText?: string;
  onAction: () => void;
  onCancel?: () => void;
  onStop?: () => void;
}

export const PlayControl: React.FC<PlayControlProps> = ({
  state,
  progressPercent = 0,
  subText,
  onAction,
  onCancel,
  onStop,
}) => {
  const getButtonStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      height: '72px',
      width: '100%',
      maxWidth: '360px',
      borderRadius: '2px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color var(--dur-state) var(--ease-loam)',
    };

    switch (state) {
      case 'READY':
      case 'INSTALL':
        return {
          ...base,
          backgroundColor: 'var(--loam-accent)',
          color: 'var(--loam-white)',
        };
      case 'RUNNING':
        return {
          ...base,
          backgroundColor: 'var(--loam-ink)',
          color: 'var(--loam-paper)',
        };
      case 'INSTALLING':
      case 'LAUNCHING':
        return {
          ...base,
          backgroundColor: 'var(--loam-accent-tint)',
          color: 'var(--loam-ink)',
        };
      case 'REPAIR':
        return {
          ...base,
          backgroundColor: 'var(--loam-accent-deep)',
          color: 'var(--loam-white)',
        };
      case 'DISABLED':
      default:
        return {
          ...base,
          backgroundColor: 'var(--loam-sunken)',
          color: 'var(--loam-text-2)',
          cursor: 'not-allowed',
        };
    }
  };

  const getLabel = () => {
    switch (state) {
      case 'INSTALL':
        return 'INSTALL';
      case 'INSTALLING':
        return `${Math.round(progressPercent)}%`;
      case 'VERIFYING':
        return 'VERIFYING';
      case 'READY':
        return 'PLAY';
      case 'LAUNCHING':
        return 'LAUNCHING';
      case 'RUNNING':
        return 'RUNNING';
      case 'REPAIR':
        return 'REPAIR';
      case 'DISABLED':
        return 'UNAVAILABLE';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <button
        style={getButtonStyles()}
        onClick={state === 'RUNNING' ? onStop : onAction}
        disabled={state === 'DISABLED' || state === 'VERIFYING'}
        aria-label={`${getLabel()} - ${subText || ''}`}
      >
        {/* Progress bar overlay for downloading */}
        {state === 'INSTALLING' && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${progressPercent}%`,
              backgroundColor: 'var(--loam-accent)',
              opacity: 0.35,
              transition: 'width 250ms ease-out',
            }}
          />
        )}
        <span
          style={{
            position: 'relative',
            zIndex: 2,
            fontSize: '24px',
            fontWeight: 600,
            letterSpacing: '0.08em',
          }}
        >
          {getLabel()}
        </span>
      </button>

      {/* Subtext line */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '360px',
        }}
      >
        <span className="text-secondary text-mono" style={{ fontSize: '12px' }}>
          {subText || (state === 'READY' ? 'Ready · verified' : '')}
        </span>
        {state === 'INSTALLING' && onCancel && (
          <button
            onClick={onCancel}
            className="text-accent-deep text-mono"
            style={{ fontSize: '11px', textDecoration: 'underline' }}
          >
            CANCEL
          </button>
        )}
      </div>
    </div>
  );
};
