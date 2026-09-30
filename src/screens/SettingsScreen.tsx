import React, { useState } from 'react';

interface SettingsScreenProps {
  onBack: () => void;
  onOpenSupport: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onOpenSupport }) => {
  const [activeSection, setActiveSection] = useState<'java' | 'storage' | 'appearance' | 'about'>('java');

  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'auto',
        padding: '36px 48px',
        backgroundColor: 'var(--loam-paper)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <button
            onClick={onBack}
            className="text-label text-accent-deep"
            style={{ marginBottom: '8px', display: 'block' }}
          >
            ← BACK TO HOME
          </button>
          <h1 className="text-h1">SETTINGS</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '36px' }}>
        {/* Navigation Sidebar */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {(['java', 'storage', 'appearance', 'about'] as const).map((sec) => (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              className="text-label"
              style={{
                padding: '10px 14px',
                textAlign: 'left',
                borderLeft: activeSection === sec ? '2px solid var(--loam-ink)' : '2px solid transparent',
                backgroundColor: activeSection === sec ? 'var(--loam-white)' : 'transparent',
                borderRadius: '2px',
              }}
            >
              {sec.toUpperCase()}
            </button>
          ))}
          <button
            onClick={onOpenSupport}
            className="text-label text-accent-deep"
            style={{ padding: '10px 14px', textAlign: 'left', marginTop: '16px' }}
          >
            SUPPORT & FEEDBACK ↗
          </button>
        </nav>

        {/* Content Pane */}
        <div className="loam-panel" style={{ padding: '28px' }}>
          {activeSection === 'java' && (
            <div>
              <h2 className="text-h2" style={{ marginBottom: '16px' }}>
                JAVA & RUNTIMES
              </h2>
              <div style={{ marginBottom: '20px' }}>
                <div className="text-label text-secondary" style={{ marginBottom: '6px' }}>
                  ACTIVE RUNTIME
                </div>
                <div className="text-mono" style={{ fontSize: '14px', marginBottom: '4px' }}>
                  Eclipse Temurin OpenJDK 21.0.3 (x64)
                </div>
                <div className="text-secondary" style={{ fontSize: '13px' }}>
                  Auto-managed in %APPDATA%\LOAM\cache\runtimes\
                </div>
              </div>
            </div>
          )}

          {activeSection === 'storage' && (
            <div>
              <h2 className="text-h2" style={{ marginBottom: '16px' }}>
                STORAGE & DATA
              </h2>
              <div style={{ marginBottom: '20px' }}>
                <div className="text-label text-secondary" style={{ marginBottom: '6px' }}>
                  DATA DIRECTORY
                </div>
                <div className="text-mono" style={{ fontSize: '13px', marginBottom: '12px' }}>
                  %APPDATA%\LOAM
                </div>
                <button
                  className="text-label"
                  style={{
                    padding: '8px 14px',
                    border: '1px solid var(--loam-line)',
                    backgroundColor: 'var(--loam-white)',
                    borderRadius: '2px',
                  }}
                >
                  CLEAN ASSET CACHE
                </button>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div>
              <h2 className="text-h2" style={{ marginBottom: '16px' }}>
                APPEARANCE
              </h2>
              <p className="text-secondary" style={{ marginBottom: '16px', fontSize: '14px' }}>
                LOAM follows your Windows system theme and high contrast settings automatically.
              </p>
              <div className="text-label text-secondary">BRAND PALETTE LOCKED</div>
              <div className="text-mono" style={{ fontSize: '13px', marginTop: '6px' }}>
                Accent: #C15F3C · Paper: #F4F3EE · Ink: #171715
              </div>
            </div>
          )}

          {activeSection === 'about' && (
            <div>
              <h2 className="text-h2" style={{ marginBottom: '16px' }}>
                ABOUT LOAM LAUNCHER
              </h2>
              <div style={{ marginBottom: '16px' }}>
                <span className="text-display" style={{ fontSize: '32px', display: 'block' }}>
                  LOAM
                </span>
                <span className="text-label text-accent-deep">YOUR WORLDS, READY.</span>
              </div>
              <div className="text-mono text-secondary" style={{ fontSize: '13px', marginBottom: '24px' }}>
                Version 1.0.0 · Windows 10/11 x64 · GPL-3.0 License
              </div>
              <div
                style={{
                  borderTop: '1px solid var(--loam-line)',
                  paddingTop: '16px',
                  fontSize: '12px',
                  color: 'var(--loam-text-2)',
                  lineHeight: '18px',
                }}
              >
                Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
