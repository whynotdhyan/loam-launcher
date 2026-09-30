import React, { useState } from 'react';
import { AccountProfile } from '../types/launcher';

interface AccountsSheetProps {
  isOpen: boolean;
  accounts: AccountProfile[];
  activeAccountId?: string;
  onClose: () => void;
  onSelectAccount: (id: string) => void;
  onAddOffline: (name: string) => void;
  onStartMicrosoftLogin: () => void;
}

export const AccountsSheet: React.FC<AccountsSheetProps> = ({
  isOpen,
  accounts,
  activeAccountId,
  onClose,
  onSelectAccount,
  onAddOffline,
  onStartMicrosoftLogin,
}) => {
  const [isAddingOffline, setIsAddingOffline] = useState(false);
  const [offlineName, setOfflineName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCreateOffline = (e: React.FormEvent) => {
    e.preventDefault();
    if (offlineName.trim().length < 3 || offlineName.trim().length > 16) {
      setErrorMsg('Display name must be between 3 and 16 characters.');
      return;
    }
    onAddOffline(offlineName.trim());
    setOfflineName('');
    setIsAddingOffline(false);
    setErrorMsg('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--loam-scrim)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        className="loam-sheet"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          padding: '32px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className="text-h2">ACCOUNTS</h2>
          <button onClick={onClose} style={{ fontSize: '18px', fontWeight: 600 }}>
            ✕
          </button>
        </div>

        {/* Account List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
          {accounts.map((acc) => {
            const isActive = acc.id === activeAccountId;
            const isMicrosoft = acc.account_type === 'microsoft';

            return (
              <div
                key={acc.id}
                onClick={() => onSelectAccount(acc.id)}
                className="loam-panel"
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  border: isActive ? '2px solid var(--loam-ink)' : '1px solid var(--loam-line)',
                  backgroundColor: isActive ? 'var(--loam-paper)' : 'var(--loam-white)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>{isActive ? '●' : '○'}</span>
                    <span style={{ fontWeight: 600, fontSize: '15px' }}>{acc.username}</span>
                  </div>
                  <span
                    className="text-label"
                    style={{
                      color: isMicrosoft ? 'var(--loam-accent-deep)' : 'var(--loam-text-2)',
                    }}
                  >
                    {isMicrosoft ? 'MICROSOFT ✓' : 'OFFLINE PROFILE'}
                  </span>
                </div>

                {/* Capability Chips */}
                <div className="text-secondary text-mono" style={{ fontSize: '12px', paddingLeft: '20px' }}>
                  {isMicrosoft
                    ? 'Java ✓ · Online servers · Realms · Personal skin'
                    : 'Local only · No ownership · Offline-mode servers'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Offline profile creation dialog */}
        {isAddingOffline ? (
          <form onSubmit={handleCreateOffline} style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '12px' }}>
              <label className="text-label text-secondary" style={{ display: 'block', marginBottom: '4px' }}>
                OFFLINE DISPLAY NAME (3-16 CHARACTERS)
              </label>
              <input
                autoFocus
                type="text"
                value={offlineName}
                onChange={(e) => setOfflineName(e.target.value)}
                placeholder="Steve"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--loam-line)',
                  borderRadius: '2px',
                  backgroundColor: 'var(--loam-white)',
                }}
              />
              {errorMsg && (
                <div className="text-accent-deep" style={{ fontSize: '12px', marginTop: '4px' }}>
                  {errorMsg}
                </div>
              )}
            </div>
            <div className="text-secondary" style={{ fontSize: '12px', marginBottom: '16px', lineHeight: '18px' }}>
              Offline profiles are local. They don't prove you own Minecraft, can't join servers that verify accounts, can't use Realms, and can't show a personal skin.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                className="text-label"
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--loam-accent)',
                  color: 'var(--loam-white)',
                  borderRadius: '2px',
                }}
              >
                CREATE OFFLINE PROFILE
              </button>
              <button
                type="button"
                onClick={() => setIsAddingOffline(false)}
                className="text-label text-secondary"
                style={{ padding: '10px 16px' }}
              >
                CANCEL
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onStartMicrosoftLogin}
              className="text-label"
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: 'var(--loam-accent)',
                color: 'var(--loam-white)',
                borderRadius: '2px',
                textAlign: 'center',
              }}
            >
              + SIGN IN WITH MICROSOFT
            </button>
            <button
              onClick={() => setIsAddingOffline(true)}
              className="text-label"
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid var(--loam-line)',
                backgroundColor: 'var(--loam-white)',
                borderRadius: '2px',
                textAlign: 'center',
              }}
            >
              + OFFLINE PROFILE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
