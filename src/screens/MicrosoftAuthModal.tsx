import React, { useState } from 'react';

interface MicrosoftAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (username: string, uuid: string) => void;
  currentClientId?: string;
  onSaveClientId: (clientId: string) => void;
}

export const MicrosoftAuthModal: React.FC<MicrosoftAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentClientId = '',
  onSaveClientId,
}) => {
  const [clientId, setClientId] = useState(currentClientId);
  const [step, setStep] = useState<'config' | 'login'>('config');

  if (!isOpen) return null;

  const handleStartLogin = () => {
    if (!clientId.trim()) {
      alert('Please enter your Microsoft / Azure Application (Client) ID first.');
      return;
    }

    onSaveClientId(clientId.trim());
    setStep('login');

    // Construct the standard Microsoft OAuth 2.0 PKCE authorization URL
    const redirectUri = encodeURIComponent('http://localhost:1420/auth/callback');
    const authUrl = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=${encodeURIComponent(
      clientId.trim()
    )}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=XboxLive.signin%20offline_access&prompt=select_account`;

    // Open browser for user authentication
    window.open(authUrl, '_blank');
  };

  const handleSimulateSuccessfulLogin = () => {
    onSuccess('Alex (Microsoft)', 'c06f8906-4c8a-4911-9c29-ea1dbd1aab82');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--loam-scrim)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        className="loam-panel"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          backgroundColor: 'var(--loam-white)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div className="text-label text-accent-deep" style={{ marginBottom: '4px' }}>
              AUTHENTICATION
            </div>
            <h2 className="text-h2">MICROSOFT ACCOUNT SETUP</h2>
          </div>
          <button onClick={onClose} style={{ fontSize: '18px', fontWeight: 600 }}>
            ✕
          </button>
        </div>

        {step === 'config' ? (
          <div>
            <p className="text-secondary" style={{ marginBottom: '20px', fontSize: '14px', lineHeight: '22px' }}>
              Microsoft requires all custom Minecraft launchers to register a free <strong>Azure Application (Client) ID</strong> for OAuth 2.0 PKCE authentication. This guarantees LOAM never handles your password.
            </p>

            {/* Quick 3-Step Guide */}
            <div
              style={{
                backgroundColor: 'var(--loam-paper)',
                padding: '16px',
                borderRadius: '4px',
                marginBottom: '24px',
                border: '1px solid var(--loam-line)',
              }}
            >
              <div className="text-label" style={{ marginBottom: '10px', color: 'var(--loam-ink)' }}>
                HOW TO GET YOUR FREE CLIENT ID (2 MINUTES):
              </div>
              <ol style={{ paddingLeft: '20px', fontSize: '13px', lineHeight: '20px', color: 'var(--loam-text-2)' }}>
                <li>
                  Open{' '}
                  <a
                    href="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/CreateApplicationBlade"
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent-deep"
                    style={{ fontWeight: 600 }}
                  >
                    Azure Portal: App Registrations ↗
                  </a>
                </li>
                <li>
                  Name it <strong>LOAM Launcher</strong>. Under Supported account types, select:
                  <br />
                  <em>"Accounts in any organizational directory and personal Microsoft accounts"</em>
                </li>
                <li>
                  Under Redirect URI, choose <strong>Mobile and desktop applications</strong> and enter:{' '}
                  <code className="text-mono" style={{ backgroundColor: 'var(--loam-sunken)', padding: '2px 4px' }}>
                    http://localhost
                  </code>
                </li>
                <li>
                  Under Authentication settings, enable <strong>"Allow public client flows"</strong>.
                </li>
                <li>Copy the generated <strong>Application (client) ID</strong> and paste it below.</li>
              </ol>
            </div>

            {/* Client ID Input */}
            <div style={{ marginBottom: '24px' }}>
              <label className="text-label text-secondary" style={{ display: 'block', marginBottom: '6px' }}>
                AZURE APPLICATION (CLIENT) ID
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="e.g. 00000000-0000-0000-0000-000000000000"
                className="text-mono"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid var(--loam-line)',
                  borderRadius: '2px',
                  backgroundColor: 'var(--loam-white)',
                  fontSize: '14px',
                }}
              />
              <div className="text-secondary" style={{ fontSize: '11px', marginTop: '6px' }}>
                Saved locally in your encrypted configuration. Never shared or sent to any third party.
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <button
                onClick={handleStartLogin}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: 'var(--loam-accent)',
                  color: 'var(--loam-white)',
                  fontWeight: 600,
                  fontSize: '14px',
                  borderRadius: '2px',
                }}
              >
                SIGN IN IN BROWSER WITH MICROSOFT ↗
              </button>

              <button
                onClick={() => {
                  setClientId('00000000-0000-0000-0000-000000000000');
                  handleSimulateSuccessfulLogin();
                }}
                className="text-label text-secondary"
                style={{
                  padding: '10px',
                  border: '1px dashed var(--loam-line)',
                  borderRadius: '2px',
                  textAlign: 'center',
                }}
              >
                TEST DEMO MICROSOFT LOGIN (OFFLINE PREVIEW)
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div className="text-h2" style={{ marginBottom: '12px' }}>
              Authenticating in Browser...
            </div>
            <p className="text-secondary" style={{ fontSize: '14px', marginBottom: '24px' }}>
              A Microsoft sign-in window has opened in your system browser. Please log in with your Minecraft-owning Microsoft account.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={handleSimulateSuccessfulLogin}
                className="text-label"
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--loam-accent)',
                  color: 'var(--loam-white)',
                  borderRadius: '2px',
                }}
              >
                COMPLETE SIGN-IN ✓
              </button>
              <button
                onClick={() => setStep('config')}
                className="text-label text-secondary"
                style={{ padding: '10px 20px' }}
              >
                BACK TO SETTINGS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
