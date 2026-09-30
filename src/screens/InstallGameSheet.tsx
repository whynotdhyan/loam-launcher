import React, { useState } from 'react';

interface InstallGameSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, mcVersion: string, loader: 'vanilla' | 'fabric', ramMb: number) => void;
  onImportOtherLauncher: () => void;
}

export const InstallGameSheet: React.FC<InstallGameSheetProps> = ({
  isOpen,
  onClose,
  onCreate,
  onImportOtherLauncher,
}) => {
  const [name, setName] = useState('My Minecraft World');
  const [mcVersion, setMcVersion] = useState('26.3');
  const [loader, setLoader] = useState<'vanilla' | 'fabric'>('fabric');
  const [ramGb, setRamGb] = useState(4);
  const [showSnapshots, setShowSnapshots] = useState(false);

  if (!isOpen) return null;

  const totalSystemRamGb = 16;
  const isHighRam = ramGb > totalSystemRamGb * 0.75;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(name, mcVersion, loader, ramGb * 1024);
    onClose();
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
          overflowY: 'auto',
          padding: '32px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className="text-h2">INSTALL + (CREATE GAME)</h2>
          <button onClick={onClose} style={{ fontSize: '18px', fontWeight: 600 }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Game Name */}
          <div style={{ marginBottom: '20px' }}>
            <label className="text-label text-secondary" style={{ display: 'block', marginBottom: '6px' }}>
              GAME NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--loam-line)',
                borderRadius: '2px',
                backgroundColor: 'var(--loam-white)',
              }}
            />
          </div>

          {/* Minecraft Version */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="text-label text-secondary">MINECRAFT VERSION</label>
              <label className="text-mono text-secondary" style={{ fontSize: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showSnapshots}
                  onChange={(e) => setShowSnapshots(e.target.checked)}
                  style={{ marginRight: '6px' }}
                />
                Show Snapshots
              </label>
            </div>
            <select
              value={mcVersion}
              onChange={(e) => setMcVersion(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--loam-line)',
                borderRadius: '2px',
                backgroundColor: 'var(--loam-white)',
              }}
            >
              <option value="26.3">26.3 (Latest Official Release)</option>
              <option value="1.21.4">1.21.4</option>
              <option value="1.20.1">1.20.1</option>
              <option value="1.19.4">1.19.4</option>
              <option value="1.18.2">1.18.2</option>
              <option value="1.16.5">1.16.5</option>
              {showSnapshots && <option value="26w12a">26w12a (Snapshot)</option>}
            </select>
          </div>

          {/* Loader Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label className="text-label text-secondary" style={{ display: 'block', marginBottom: '6px' }}>
              MOD LOADER
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setLoader('vanilla')}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: loader === 'vanilla' ? '2px solid var(--loam-ink)' : '1px solid var(--loam-line)',
                  backgroundColor: loader === 'vanilla' ? 'var(--loam-paper)' : 'var(--loam-white)',
                  borderRadius: '2px',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Vanilla
              </button>
              <button
                type="button"
                onClick={() => setLoader('fabric')}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: loader === 'fabric' ? '2px solid var(--loam-ink)' : '1px solid var(--loam-line)',
                  backgroundColor: loader === 'fabric' ? 'var(--loam-paper)' : 'var(--loam-white)',
                  borderRadius: '2px',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Fabric Loader
              </button>
            </div>
          </div>

          {/* RAM Allocation Slider */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="text-label text-secondary">MEMORY ALLOCATION</label>
              <span className="text-mono" style={{ fontSize: '13px', fontWeight: 600 }}>
                {ramGb} GB ({ramGb * 1024} MB)
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={16}
              step={1}
              value={ramGb}
              onChange={(e) => setRamGb(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--loam-accent)' }}
            />
            {isHighRam && (
              <div className="text-accent-deep" style={{ fontSize: '12px', marginTop: '6px' }}>
                Allocating more than 75% of system RAM may cause Windows stuttering.
              </div>
            )}
          </div>

          {/* Size Review */}
          <div
            className="loam-panel"
            style={{
              padding: '14px',
              marginBottom: '28px',
              backgroundColor: 'var(--loam-paper)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="text-label text-secondary">ESTIMATED STORAGE</div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>~1.05 GB download · 2.4 GB on disk</div>
            </div>
            <div className="text-mono text-secondary" style={{ fontSize: '12px' }}>
              Isolated Sandbox
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: 'var(--loam-accent)',
                color: 'var(--loam-white)',
                fontWeight: 600,
                fontSize: '15px',
                borderRadius: '2px',
              }}
            >
              CREATE GAME
            </button>

            <button
              type="button"
              onClick={onImportOtherLauncher}
              className="text-label text-secondary"
              style={{
                padding: '10px',
                textAlign: 'center',
              }}
            >
              IMPORT FROM ANOTHER LAUNCHER ↗
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
