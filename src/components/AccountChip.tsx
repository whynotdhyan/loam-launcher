import React from 'react';
import { AccountProfile } from '../types/launcher';

interface AccountChipProps {
  account?: AccountProfile;
  onClick: () => void;
}

export const AccountChip: React.FC<AccountChipProps> = ({ account, onClick }) => {
  if (!account) {
    return (
      <button
        onClick={onClick}
        className="text-label"
        style={{
          padding: '6px 12px',
          border: '1px solid var(--loam-line)',
          backgroundColor: 'var(--loam-white)',
          borderRadius: '2px',
          color: 'var(--loam-accent-deep)',
        }}
      >
        + CHOOSE ACCOUNT
      </button>
    );
  }

  const isMicrosoft = account.account_type === 'microsoft';

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 10px',
        backgroundColor: 'var(--loam-white)',
        border: '1px solid var(--loam-line)',
        borderRadius: '2px',
      }}
      aria-label={`Current account: ${account.username}, ${isMicrosoft ? 'Microsoft verified' : 'Offline profile'}`}
    >
      {/* Monogram indicator */}
      <span
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '2px',
          backgroundColor: isMicrosoft ? 'var(--loam-accent-tint)' : 'var(--loam-sunken)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 600,
          color: isMicrosoft ? 'var(--loam-accent-deep)' : 'var(--loam-text-2)',
        }}
      >
        {account.username.slice(0, 1).toUpperCase()}
      </span>

      <span style={{ fontWeight: 500, fontSize: '14px' }}>{account.username}</span>

      <span
        className="text-label"
        style={{
          color: isMicrosoft ? 'var(--loam-accent-deep)' : 'var(--loam-text-2)',
          fontSize: '10px',
          paddingLeft: '4px',
        }}
      >
        {isMicrosoft ? 'MICROSOFT ✓' : 'OFFLINE PROFILE'}
      </span>
    </button>
  );
};
