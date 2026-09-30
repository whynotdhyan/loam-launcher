import React, { useState } from 'react';
import { GuidedReportData } from '../types/launcher';

interface SupportFeedbackScreenProps {
  onBack: () => void;
}

export const SupportFeedbackScreen: React.FC<SupportFeedbackScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'report'>('overview');
  const [reportType, setReportType] = useState('Crash on launch');
  const [happened, setHappened] = useState('');
  const [expected, setExpected] = useState('');
  const [steps, setSteps] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate stable sample report ID
  const [reportId] = useState('LOAM-7K3Q-92');

  const reportData: GuidedReportData = {
    report_id: reportId,
    report_type: reportType,
    loam_version: '1.0.0',
    os_version: 'Windows 11 (Build 26100)',
    total_ram_gb: 16,
    mc_version: '26.3',
    loader: 'Fabric 0.16.9',
    java_version: '21',
    memory_mb: 4096,
    account_type: 'Offline Profile',
    happened,
    expected,
    steps,
  };

  const formattedDiscordSummary = `**LOAM report** ${reportData.report_id}
**Type:** ${reportData.report_type}
**LOAM:** ${reportData.loam_version} · ${reportData.os_version} x64 · ${reportData.total_ram_gb} GB
**Game:** ${reportData.mc_version} · ${reportData.loader} · Java ${reportData.java_version} · ${reportData.memory_mb} MB
**Account type:** ${reportData.account_type}
**Happened:** ${happened || '(details)'}
**Expected:** ${expected || '(details)'}
**Steps:** ${steps || '(steps)'}
**Diagnostics zip:** attached (report ID above)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedDiscordSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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
          <h1 className="text-h1">SUPPORT & FEEDBACK</h1>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div>
          {/* Three main cards as specified in Section 5.1 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginBottom: '36px',
            }}
          >
            {/* Card 1: Ask the community */}
            <div className="loam-panel" style={{ padding: '24px' }}>
              <div className="text-label text-secondary" style={{ marginBottom: '8px' }}>
                ASK THE COMMUNITY
              </div>
              <p style={{ marginBottom: '24px', fontSize: '14px' }}>
                Join our Discord community for live troubleshooting, assistance, and discussion.
              </p>
              <a
                href="https://discord.gg/loam-launcher"
                target="_blank"
                rel="noreferrer"
                className="text-label text-accent-deep"
                style={{
                  display: 'inline-block',
                  padding: '10px 16px',
                  backgroundColor: 'var(--loam-accent-tint)',
                  borderRadius: '2px',
                  textDecoration: 'none',
                }}
              >
                OPEN DISCORD ↗
              </a>
            </div>

            {/* Card 2: Report a problem */}
            <div className="loam-panel" style={{ padding: '24px' }}>
              <div className="text-label text-secondary" style={{ marginBottom: '8px' }}>
                REPORT A PROBLEM
              </div>
              <p style={{ marginBottom: '24px', fontSize: '14px' }}>
                Guided form builds a redacted, token-free diagnostic report for fast investigation.
              </p>
              <button
                onClick={() => setActiveTab('report')}
                className="text-label"
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--loam-accent)',
                  color: 'var(--loam-white)',
                  borderRadius: '2px',
                }}
              >
                START REPORT
              </button>
            </div>

            {/* Card 3: What's new */}
            <div className="loam-panel" style={{ padding: '24px' }}>
              <div className="text-label text-secondary" style={{ marginBottom: '8px' }}>
                WHAT'S NEW
              </div>
              <p style={{ marginBottom: '24px', fontSize: '14px' }}>
                Review verified fixes, release notes, and known issue fingerprints for LOAM.
              </p>
              <button
                className="text-label"
                style={{
                  padding: '10px 16px',
                  border: '1px solid var(--loam-line)',
                  borderRadius: '2px',
                }}
              >
                VIEW NOTES
              </button>
            </div>
          </div>

          {/* Recent reports & version metadata */}
          <div style={{ borderTop: '1px solid var(--loam-line)', paddingTop: '20px' }}>
            <div className="text-label text-secondary" style={{ marginBottom: '12px' }}>
              SYSTEM DIAGNOSTICS
            </div>
            <div className="text-mono" style={{ fontSize: '13px' }}>
              LOAM Version 1.0.0 · Windows 11 x64 (Build 26100) · 16 GB Total Memory · OpenJDK 21
            </div>
          </div>
        </div>
      ) : (
        /* Guided Report View */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label className="text-label text-secondary" style={{ display: 'block', marginBottom: '6px' }}>
                PROBLEM TYPE
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--loam-line)',
                  borderRadius: '2px',
                  backgroundColor: 'var(--loam-white)',
                }}
              >
                <option value="Crash on launch">Crash on launch</option>
                <option value="Install failed">Install failed</option>
                <option value="Import failed">Import failed</option>
                <option value="Login problem">Login problem</option>
                <option value="Visual glitch">Visual glitch</option>
                <option value="Performance">Performance</option>
                <option value="Other / idea">Other / idea</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="text-label text-secondary" style={{ display: 'block', marginBottom: '6px' }}>
                WHAT HAPPENED
              </label>
              <textarea
                rows={3}
                value={happened}
                onChange={(e) => setHappened(e.target.value)}
                placeholder="Game exited immediately after launch button was clicked..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--loam-line)',
                  borderRadius: '2px',
                  backgroundColor: 'var(--loam-white)',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="text-label text-secondary" style={{ display: 'block', marginBottom: '6px' }}>
                WHAT YOU EXPECTED
              </label>
              <textarea
                rows={3}
                value={expected}
                onChange={(e) => setExpected(e.target.value)}
                placeholder="Game window to appear with Minecraft title screen..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--loam-line)',
                  borderRadius: '2px',
                  backgroundColor: 'var(--loam-white)',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="text-label text-secondary" style={{ display: 'block', marginBottom: '6px' }}>
                STEPS TO REPRODUCE
              </label>
              <textarea
                rows={3}
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="1. Select Survival SMP\n2. Click PLAY"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--loam-line)',
                  borderRadius: '2px',
                  backgroundColor: 'var(--loam-white)',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCopy}
                className="text-label"
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'var(--loam-accent)',
                  color: 'var(--loam-white)',
                  borderRadius: '2px',
                }}
              >
                {copied ? 'COPIED TO CLIPBOARD ✓' : 'COPY REPORT (FOR DISCORD)'}
              </button>
              <button
                onClick={() => alert('Diagnostics bundle saved to %APPDATA%/LOAM/reports/')}
                className="text-label"
                style={{
                  padding: '12px 20px',
                  border: '1px solid var(--loam-line)',
                  backgroundColor: 'var(--loam-white)',
                  borderRadius: '2px',
                }}
              >
                SAVE DIAGNOSTICS ZIP
              </button>
            </div>
          </div>

          {/* Live Preview Pane */}
          <div className="loam-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="text-label text-secondary">LIVE DISCORD PREVIEW ({formattedDiscordSummary.length}/1800 chars)</span>
              <span className="text-mono text-secondary" style={{ fontSize: '11px' }}>REDACTED</span>
            </div>
            <pre
              className="text-mono"
              style={{
                backgroundColor: 'var(--loam-sunken)',
                padding: '14px',
                borderRadius: '2px',
                whiteSpace: 'pre-wrap',
                fontSize: '12px',
                lineHeight: '18px',
              }}
            >
              {formattedDiscordSummary}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
