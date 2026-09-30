import React from 'react';
import { GameInstance, AccountProfile, PlayState } from '../types/launcher';
import { PlayControl } from '../components/PlayControl';
import { GameSwitcher } from '../components/GameSwitcher';
import { AccountChip } from '../components/AccountChip';

interface HomeScreenProps {
  activeGame?: GameInstance;
  allGames: GameInstance[];
  activeAccount?: AccountProfile;
  playState: PlayState;
  progressPercent: number;
  onPlayAction: () => void;
  onCancelInstall: () => void;
  onStopGame: () => void;
  onSelectGame: (id: string) => void;
  onOpenInstallSheet: () => void;
  onOpenAccounts: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  activeGame,
  allGames,
  activeAccount,
  playState,
  progressPercent,
  onPlayAction,
  onCancelInstall,
  onStopGame,
  onSelectGame,
  onOpenInstallSheet,
  onOpenAccounts,
  onOpenSettings,
  onOpenSupport,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: '36px 48px',
        boxSizing: 'border-box',
        justifyContent: 'space-between',
      }}
    >
      {/* Header bar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            LOAM
          </h1>
          <div className="text-label" style={{ color: 'var(--loam-text-2)', marginTop: '2px' }}>
            JAVA EDITION
          </div>
          <div
            className="text-label"
            style={{ color: 'var(--loam-accent-deep)', marginTop: '2px' }}
          >
            YOUR WORLDS, READY.
          </div>
        </div>

        {/* Right header controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AccountChip account={activeAccount} onClick={onOpenAccounts} />

          {/* Support button (?) */}
          <button
            onClick={onOpenSupport}
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid var(--loam-line)',
              backgroundColor: 'var(--loam-white)',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '14px',
            }}
            title="Support & Feedback (F1)"
            aria-label="Support & Feedback"
          >
            ?
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid var(--loam-line)',
              backgroundColor: 'var(--loam-white)',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}
            title="Settings (Ctrl+,)"
            aria-label="Settings"
          >
            ⚙
          </button>
        </div>
      </header>

      {/* Main hero section (Swiss layout aligned left) */}
      <main style={{ marginTop: 'auto', marginBottom: 'auto', maxWidth: '640px' }}>
        {activeGame ? (
          <div>
            <div className="text-display" style={{ marginBottom: '8px' }}>
              {activeGame.name}
            </div>
            <div
              className="text-mono text-secondary"
              style={{ fontSize: '15px', marginBottom: '28px' }}
            >
              {activeGame.mc_version} ·{' '}
              {activeGame.loader === 'fabric' ? 'Fabric' : 'Vanilla'} ·{' '}
              {Math.round(activeGame.ram_mb / 1024)} GB
            </div>

            <PlayControl
              state={playState}
              progressPercent={progressPercent}
              subText={
                playState === 'READY'
                  ? 'Ready · verified 2 min ago'
                  : playState === 'INSTALLING'
                  ? `Downloading files... ${Math.round(progressPercent)}%`
                  : undefined
              }
              onAction={onPlayAction}
              onCancel={onCancelInstall}
              onStop={onStopGame}
            />
          </div>
        ) : (
          <div>
            <div className="text-display" style={{ marginBottom: '16px' }}>
              Nothing here yet.
            </div>
            <p className="text-secondary" style={{ marginBottom: '24px' }}>
              Create your first Minecraft installation or import game data from another launcher.
            </p>
            <button
              onClick={onOpenInstallSheet}
              style={{
                height: '56px',
                padding: '0 32px',
                backgroundColor: 'var(--loam-accent)',
                color: 'var(--loam-white)',
                fontWeight: 600,
                fontSize: '16px',
                borderRadius: '2px',
              }}
            >
              INSTALL +
            </button>
          </div>
        )}
      </main>

      {/* Footer bar */}
      <footer>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={onOpenInstallSheet}
              className="text-label"
              style={{
                padding: '8px 14px',
                backgroundColor: 'var(--loam-white)',
                border: '1px solid var(--loam-line)',
                borderRadius: '2px',
                color: 'var(--loam-ink)',
              }}
            >
              INSTALL +
            </button>

            <span className="text-secondary" style={{ fontSize: '13px' }}>
              ⇣ Drop a mod, pack or world
            </span>
          </div>

          <GameSwitcher
            games={allGames}
            activeGameId={activeGame?.id || ''}
            onSelectGame={onSelectGame}
            onOpenAll={() => {}}
          />
        </div>

        {/* News line */}
        <div
          style={{
            borderTop: '1px solid var(--loam-line)',
            paddingTop: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            <span className="text-label text-secondary">30 SEP</span>
            <span>Minecraft Java Edition 26.3 Release candidate verified</span>
          </div>
          <a
            href="https://www.minecraft.net/en-us/article/minecraft-java-edition-26-3"
            target="_blank"
            rel="noreferrer"
            className="text-label text-accent-deep"
            style={{ textDecoration: 'none' }}
          >
            READ ↗
          </a>
        </div>
      </footer>
    </div>
  );
};
