import React from 'react';
import { ActiveTab } from './Header';

interface FooterProps {
  onSelectTab: (tab: ActiveTab) => void;
  onShowToast: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onShowToast }) => {
  return (
    <footer className="w-full bg-surface-container-lowest mt-space-xl">
      <div className="w-full px-gutter py-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <span className="font-headline-sm text-headline-sm text-primary">TruthLens</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            © 2024 Editorial Forensic Laboratory. Rigorous broadsheet veracity instrumentation.
          </span>
        </div>
        <div className="flex items-center gap-space-lg">
          <button
            type="button"
            onClick={() => onSelectTab('dataset-transparency-pipeline')}
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            WELFake 72,134 Corroborated Tokens
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('model-benchmark-matrix')}
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            Triple-Model Consensus
          </button>
          <button
            type="button"
            onClick={() =>
              onShowToast('IFCN Protocol v2.8 • Human-in-the-Loop Editorial Standard Active')
            }
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            Journalistic Disclosures
          </button>
        </div>
      </div>
    </footer>
  );
};
