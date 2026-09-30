import React, { useState, useEffect } from 'react';
import { GameInstance, AccountProfile, PlayState } from './types/launcher';
import { HomeScreen } from './screens/HomeScreen';
import { InstallGameSheet } from './screens/InstallGameSheet';
import { AccountsSheet } from './screens/AccountsSheet';
import { SettingsScreen } from './screens/SettingsScreen';
import { SupportFeedbackScreen } from './screens/SupportFeedbackScreen';
import { CommandPalette } from './components/CommandPalette';
import { MicrosoftAuthModal } from './screens/MicrosoftAuthModal';

export const App: React.FC = () => {
  // Navigation screen
  const [currentScreen, setCurrentScreen] = useState<'home' | 'settings' | 'support'>('home');

  // Modals & Sheets
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMicrosoftModalOpen, setIsMicrosoftModalOpen] = useState(false);
  const [microsoftClientId, setMicrosoftClientId] = useState(() => {
    return localStorage.getItem('loam_ms_client_id') || '';
  });

  // Sample data conforming to Brief v2
  const [accounts, setAccounts] = useState<AccountProfile[]>([
    {
      id: 'acc_offline_testing',
      username: 'Testing',
      account_type: 'offline',
      uuid: 'd8a8b1b5-3d84-3c81-8176-57e03444f23b',
      capabilities: {
        verified_ownership: false,
        singleplayer_and_lan: true,
        online_mode_servers: false,
        offline_mode_servers: true,
        realms_access: false,
        personal_skin: false,
      },
    },
    {
      id: 'acc_ms_alex',
      username: 'Alex',
      account_type: 'microsoft',
      uuid: 'c06f8906-4c8a-4911-9c29-ea1dbd1aab82',
      capabilities: {
        verified_ownership: true,
        singleplayer_and_lan: true,
        online_mode_servers: true,
        offline_mode_servers: true,
        realms_access: true,
        personal_skin: true,
      },
    },
  ]);
  const [activeAccountId, setActiveAccountId] = useState<string>('acc_ms_alex');

  const [games, setGames] = useState<GameInstance[]>([
    {
      schema_version: 1,
      id: 'game_survival_smp',
      name: 'Survival SMP',
      mc_version: '26.3',
      loader: 'fabric',
      loader_version: '0.16.9',
      ram_mb: 4096,
      created_at: new Date().toISOString(),
    },
    {
      schema_version: 1,
      id: 'game_creative_lab',
      name: 'Creative Lab',
      mc_version: '1.21.4',
      loader: 'vanilla',
      ram_mb: 2048,
      created_at: new Date().toISOString(),
    },
  ]);
  const [activeGameId, setActiveGameId] = useState<string>('game_survival_smp');

  const [playState, setPlayState] = useState<PlayState>('READY');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const activeGame = games.find((g) => g.id === activeGameId);
  const activeAccount = accounts.find((a) => a.id === activeAccountId);

  // Global Keyboard Shortcuts (Section 3.6 of Brief)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K -> Command palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // Ctrl+Enter -> Play
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handlePlay();
      }
      // Ctrl+N -> Install +
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsInstallOpen(true);
      }
      // Ctrl+, -> Settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setCurrentScreen('settings');
      }
      // F1 -> Support & Feedback
      if (e.key === 'F1') {
        e.preventDefault();
        setCurrentScreen('support');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playState]);

  const handlePlay = () => {
    if (playState === 'READY') {
      setPlayState('LAUNCHING');
      setTimeout(() => {
        setPlayState('RUNNING');
      }, 1500);
    } else if (playState === 'INSTALL') {
      setPlayState('INSTALLING');
      setProgressPercent(10);
      const interval = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setPlayState('READY');
            return 100;
          }
          return prev + 15;
        });
      }, 300);
    }
  };

  const handleStop = () => {
    setPlayState('READY');
  };

  const handleCancelInstall = () => {
    setPlayState('INSTALL');
    setProgressPercent(0);
  };

  const handleCreateGame = (name: string, mcVersion: string, loader: 'vanilla' | 'fabric', ramMb: number) => {
    const newGame: GameInstance = {
      schema_version: 1,
      id: `game_${Date.now()}`,
      name,
      mc_version: mcVersion,
      loader,
      ram_mb: ramMb,
      created_at: new Date().toISOString(),
    };
    setGames((prev) => [...prev, newGame]);
    setActiveGameId(newGame.id);
  };

  const handleAddOffline = (name: string) => {
    const newAcc: AccountProfile = {
      id: `offline_${Date.now()}`,
      username: name,
      account_type: 'offline',
      uuid: 'd8a8b1b5-3d84-3c81-8176-57e03444f23b',
      capabilities: {
        verified_ownership: false,
        singleplayer_and_lan: true,
        online_mode_servers: false,
        offline_mode_servers: true,
        realms_access: false,
        personal_skin: false,
      },
    };
    setAccounts((prev) => [...prev, newAcc]);
    setActiveAccountId(newAcc.id);
  };

  const handlePaletteAction = (key: string) => {
    if (key === 'play') handlePlay();
    if (key === 'install') setIsInstallOpen(true);
    if (key === 'settings') setCurrentScreen('settings');
    if (key === 'support') setCurrentScreen('support');
    if (key === 'report') setCurrentScreen('support');
    if (key === 'open_folder') alert('Opening game data folder: %APPDATA%/LOAM/games/...');
  };

  return (
    <div>
      {currentScreen === 'home' && (
        <HomeScreen
          activeGame={activeGame}
          allGames={games}
          activeAccount={activeAccount}
          playState={playState}
          progressPercent={progressPercent}
          onPlayAction={handlePlay}
          onCancelInstall={handleCancelInstall}
          onStopGame={handleStop}
          onSelectGame={(id) => setActiveGameId(id)}
          onOpenInstallSheet={() => setIsInstallOpen(true)}
          onOpenAccounts={() => setIsAccountsOpen(true)}
          onOpenSettings={() => setCurrentScreen('settings')}
          onOpenSupport={() => setCurrentScreen('support')}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          onBack={() => setCurrentScreen('home')}
          onOpenSupport={() => setCurrentScreen('support')}
        />
      )}

      {currentScreen === 'support' && (
        <SupportFeedbackScreen onBack={() => setCurrentScreen('home')} />
      )}

      {/* Sheets & Dialogs */}
      <InstallGameSheet
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
        onCreate={handleCreateGame}
        onImportOtherLauncher={() => alert('Select source folder (e.g. %APPDATA%/.minecraft) to import saves, mods, and options.')}
      />

      <AccountsSheet
        isOpen={isAccountsOpen}
        accounts={accounts}
        activeAccountId={activeAccountId}
        onClose={() => setIsAccountsOpen(false)}
        onSelectAccount={(id) => {
          setActiveAccountId(id);
          setIsAccountsOpen(false);
        }}
        onAddOffline={handleAddOffline}
        onStartMicrosoftLogin={() => {
          setIsAccountsOpen(false);
          setIsMicrosoftModalOpen(true);
        }}
      />

      <MicrosoftAuthModal
        isOpen={isMicrosoftModalOpen}
        onClose={() => setIsMicrosoftModalOpen(false)}
        currentClientId={microsoftClientId}
        onSaveClientId={(id) => {
          setMicrosoftClientId(id);
          localStorage.setItem('loam_ms_client_id', id);
        }}
        onSuccess={(username, uuid) => {
          const newMsAcc: AccountProfile = {
            id: `ms_${uuid}`,
            username,
            account_type: 'microsoft',
            uuid,
            capabilities: {
              verified_ownership: true,
              singleplayer_and_lan: true,
              online_mode_servers: true,
              offline_mode_servers: true,
              realms_access: true,
              personal_skin: true,
            },
          };
          setAccounts((prev) => [...prev.filter((a) => a.id !== newMsAcc.id), newMsAcc]);
          setActiveAccountId(newMsAcc.id);
        }}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onAction={handlePaletteAction}
      />
    </div>
  );
};
