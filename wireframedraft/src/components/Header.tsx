import React, { useState } from 'react';

export type ActiveTab =
  | 'article-url-analyzer'
  | 'model-benchmark-matrix'
  | 'dataset-transparency-pipeline'
  | 'api-export';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onShowToast: (msg: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const LIGHT_LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1XnZairM7EWDUlppOcJtYqft5FDdfETWvzoX3ere2arm1_jOt_wIy9LtlatXHiCeCGUFW_GS8N_AFcc18nQnrG3UDNwunyCzKAQRCGm14facqbFI-jGnPbrechnL4C11V2B_rtMcPHWCW9_Z3Gsj38xwUK6Qqvd5C44B1MO50tpmH9xx3eILVRrU4jlA6wfA1X_h2HmClGEic2PUqLQoObov0nFMc_h_cBTYQGT06orDxD6chQ5qcKQyg';

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onShowToast,
  theme,
  onToggleTheme,
}) => {
  const [imgError, setImgError] = useState(false);
  const isDark = theme === 'dark';

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'article-url-analyzer', label: 'Article & URL Analyzer' },
    { id: 'model-benchmark-matrix', label: 'Model Benchmark Matrix' },
    { id: 'dataset-transparency-pipeline', label: 'Dataset Transparency & Pipeline' },
    { id: 'api-export', label: 'API & Export' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-colors duration-200">
      <div className="h-24 w-full flex flex-col justify-between">
        {/* Top Row */}
        <div className="h-14 px-gutter flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <button
              type="button"
              onClick={() => onSelectTab('article-url-analyzer')}
              className="flex items-center gap-space-md text-left focus:outline-none cursor-pointer group"
            >
              {!imgError && !isDark ? (
                <img
                  alt="TruthLens Editorial Logo"
                  className="h-8 w-auto object-contain"
                  src={LIGHT_LOGO_URL}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="h-8 w-8 shrink-0" viewBox="0 0 64 64" fill="none">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill={isDark ? '#141f36' : '#f0f3ff'}
                      stroke={isDark ? '#e2e8f0' : '#0a1124'}
                      strokeWidth="5"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="20"
                      stroke="#069669"
                      strokeWidth="3"
                      strokeDasharray="4 4"
                    />
                    <line
                      x1="32"
                      y1="6"
                      x2="32"
                      y2="16"
                      stroke={isDark ? '#e2e8f0' : '#0a1124'}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <line
                      x1="32"
                      y1="48"
                      x2="32"
                      y2="58"
                      stroke={isDark ? '#e2e8f0' : '#0a1124'}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <line
                      x1="6"
                      y1="32"
                      x2="16"
                      y2="32"
                      stroke={isDark ? '#e2e8f0' : '#0a1124'}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <line
                      x1="48"
                      y1="32"
                      x2="58"
                      y2="32"
                      stroke={isDark ? '#e2e8f0' : '#0a1124'}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <polygon points="32,22 40,32 32,42 24,32" fill={isDark ? '#e2e8f0' : '#0a1124'} />
                    <circle cx="32" cy="32" r="3.5" fill="#069669" />
                  </svg>
                </div>
              )}
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none">
                    Truth
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-tertiary-container tracking-tight leading-none">
                    Lens
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">
                  Editorial Intelligence
                </span>
              </div>
            </button>
            <div className="hidden md:flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-surface-container-low border border-surface-container">
              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-surface tracking-wide uppercase">
                LIVE VERIFICATION ENGINE (WELFake 72K)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="hidden lg:flex items-center gap-space-sm">
              <div className="flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  CHECKPOINT:
                </span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold font-mono">
                  v2.8.4-RELEASE
                </span>
              </div>
              <div className="flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  LATENCY:
                </span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold font-mono">
                  18ms AVG
                </span>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('dataset-transparency-pipeline')}
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors uppercase px-space-xs cursor-pointer"
              >
                DOCS
              </button>
            </div>

            {/* Global Theme Mode Toggle Icon */}
            <button
              type="button"
              onClick={onToggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-all flex items-center justify-center cursor-pointer border border-outline-variant/30 shadow-xs focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span className="material-symbols-outlined text-[20px] transition-transform duration-300 hover:rotate-45">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Editorial Analyst Profile Button */}
            <button
              type="button"
              onClick={() =>
                onShowToast('Editorial Analyst Session #TL-9942 • Clearance Level 4 Verified')
              }
              title="Editorial Analyst Profile"
              className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>
          </div>
        </div>

        {/* Bottom Navigation Row */}
        <div className="h-10 px-gutter flex items-center justify-between bg-surface-container-low border-b border-surface-container">
          <nav className="flex items-center gap-space-xs h-full overflow-x-auto">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={
                    isActive
                      ? 'font-label-md text-label-md px-space-md py-2 transition-colors bg-primary text-on-primary font-medium rounded-t shadow-sm whitespace-nowrap cursor-pointer'
                      : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface px-space-md py-2 transition-colors whitespace-nowrap cursor-pointer'
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden xl:flex items-center gap-space-sm overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              LATEST TELEMETRY:
            </span>
            <span className="font-label-sm text-label-sm text-on-surface font-mono">
              CLAIM #84920 [CORROBORATED 98.4%]
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-label-sm text-label-sm text-on-surface font-mono">
              REUTERS-INGEST [VALID]
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-label-sm text-label-sm text-error font-mono">
              SRC-DRIFT DETECTED [P-A CLF: 81.2%]
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
