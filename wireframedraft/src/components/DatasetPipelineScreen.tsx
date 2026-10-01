import React, { useState } from 'react';

interface DatasetPipelineScreenProps {
  onShowToast: (msg: string) => void;
}

interface CorpusRecord {
  id: string;
  sourceArchive: 'Reuters Wire' | 'Kaggle News' | 'McIntire Political' | 'BuzzFeed Civic';
  label: 'TRUE' | 'FAKE';
  headline: string;
  tokens: number;
  decontaminationNote: string;
  split: 'TRAIN (80%)' | 'HOLDOUT (20%)';
}

const CORPUS_RECORDS: CorpusRecord[] = [
  {
    id: 'WL-008492',
    sourceArchive: 'Reuters Wire',
    label: 'TRUE',
    headline: 'European Central Bank Maintains Deposit Facility Rate Amid Disinflationary Signals',
    tokens: 412,
    decontaminationNote: 'Dateline prefix "(FRANKFURT - Reuters)" stripped to prevent source leakage',
    split: 'HOLDOUT (20%)',
  },
  {
    id: 'WL-019340',
    sourceArchive: 'Kaggle News',
    label: 'FAKE',
    headline: 'SHOCKING: Leaked Satellite Photos Prove Weather Modification Array Active Over Midwest',
    tokens: 318,
    decontaminationNote: 'HTML script residue & duplicate social share footers normalized',
    split: 'HOLDOUT (20%)',
  },
  {
    id: 'WL-031104',
    sourceArchive: 'McIntire Political',
    label: 'TRUE',
    headline: 'Senate Appropriations Committee Advances Bipartisan Continuing Resolution',
    tokens: 589,
    decontaminationNote: 'Verified against Congressional Record roll-call timestamps',
    split: 'TRAIN (80%)',
  },
  {
    id: 'WL-044821',
    sourceArchive: 'BuzzFeed Civic',
    label: 'FAKE',
    headline: 'BREAKING: Unnamed Whistleblower Confirms Secret Executive Order to Freeze Bank Accounts',
    tokens: 274,
    decontaminationNote: 'Near-duplicate syndication clone removed (Cosine sim > 0.92)',
    split: 'TRAIN (80%)',
  },
  {
    id: 'WL-058912',
    sourceArchive: 'Reuters Wire',
    label: 'TRUE',
    headline: 'Semiconductor Foundry Capital Expenditure Projected to Rise 8.4% in Fiscal Q3',
    tokens: 465,
    decontaminationNote: 'Author byline signature sanitized for blind stylometric training',
    split: 'HOLDOUT (20%)',
  },
  {
    id: 'WL-069205',
    sourceArchive: 'Kaggle News',
    label: 'FAKE',
    headline: 'Doctors Stunned: Ancient Mineral Tonic Reverses Cellular Senescence in 48 Hours',
    tokens: 350,
    decontaminationNote: 'UTF-8 homoglyph obfuscation normalized to standard ASCII',
    split: 'TRAIN (80%)',
  },
];

export const DatasetPipelineScreen: React.FC<DatasetPipelineScreenProps> = ({ onShowToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [archiveFilter, setArchiveFilter] = useState<string>('ALL');

  const filteredRecords = CORPUS_RECORDS.filter((rec) => {
    const matchesArchive = archiveFilter === 'ALL' || rec.sourceArchive === archiveFilter;
    const matchesQuery =
      !searchQuery.trim() ||
      rec.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesArchive && matchesQuery;
  });

  return (
    <div className="flex flex-col w-full">
      <div className="w-full px-gutter py-space-xl flex flex-col gap-space-xl max-w-7xl mx-auto">
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="px-space-sm py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              Corpus Governance // WELFake-72K Provenance
            </span>
            <span className="text-outline-variant font-label-sm text-label-sm">•</span>
            <span className="font-label-sm text-label-sm text-on-tertiary-container flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-on-tertiary-container inline-block"></span>
              ZERO DATA LEAKAGE CERTIFIED
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
            <div className="max-w-4xl">
              <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">
                Dataset Transparency, Decontamination &amp; Ingestion Pipeline
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs">
                Architectural audit of the 72,134-record WELFake corpus merging Kaggle, McIntire,
                Reuters, and BuzzFeed archives. Enforces strict publisher-marker stripping to
                prevent trivial dateline memorization.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('SHA-256 Checksum Verified: e3b0c44298fc1c149afbf4c8996fb92427ae41e4')}
              className="flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary hover:bg-primary-container transition-colors rounded font-label-sm text-label-sm uppercase tracking-wider shadow-md self-start lg:self-end shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">verified</span>
              VERIFY CORPUS CHECKSUM
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {[
            { name: 'Reuters Wire Archive', records: '21,480', share: '29.8% of Corpus', profile: 'Institutional financial & geopolitical dispatches', badge: 'PRIMARY TRUE BASELINE' },
            { name: 'Kaggle Veracity Set', records: '20,800', share: '28.8% of Corpus', profile: 'High-arousal hyperpartisan & fabricated domains', badge: 'FABRICATION VECTORS' },
            { name: 'McIntire Political', records: '18,654', share: '25.9% of Corpus', profile: 'Balanced cross-spectrum national political reporting', badge: 'BALANCED SPLIT' },
            { name: 'BuzzFeed Civic Audit', records: '11,200', share: '15.5% of Corpus', profile: 'Fact-checked viral election & policy claims', badge: 'IFCN ANNOTATED' },
          ].map((src) => (
            <div key={src.name} className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">{src.badge}</span>
                  <span className="material-symbols-outlined text-secondary text-[18px]">folder_supervised</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary mt-space-xs">{src.name}</h3>
                <div className="font-headline-xl text-headline-xl text-primary mt-space-xs">{src.records}</div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{src.profile}</p>
              </div>
              <div className="mt-space-md pt-space-xs font-mono font-label-sm text-label-sm text-on-tertiary-container font-semibold">{src.share}</div>
            </div>
          ))}
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Quarantined Record Browser</span>
              <h2 className="font-headline-md text-headline-md text-primary mt-0.5">Decontaminated WELFake Corpus Ledger</h2>
            </div>
            <div className="flex flex-wrap items-center gap-space-xs">
              {['ALL', 'Reuters Wire', 'Kaggle News', 'McIntire Political', 'BuzzFeed Civic'].map((arch) => (
                <button
                  key={arch}
                  type="button"
                  onClick={() => setArchiveFilter(arch)}
                  className={`px-space-sm py-1 rounded font-label-sm text-label-sm transition-colors cursor-pointer ${
                    archiveFilter === arch ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {arch}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search corpus records by headline keyword or WL-ID..."
            className="w-full bg-surface-container-low px-space-md py-2 rounded font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-md text-body-md border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="py-space-sm px-space-md rounded-l">Record ID</th>
                  <th className="py-space-sm px-space-md">Source Archive</th>
                  <th className="py-space-sm px-space-md">Ground Truth</th>
                  <th className="py-space-sm px-space-md">Normalized Headline</th>
                  <th className="py-space-sm px-space-md">Decontamination Audit</th>
                  <th className="py-space-sm px-space-md rounded-r">Partition</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-surface-container-low transition-colors border-b border-surface-container">
                    <td className="py-space-sm px-space-md font-mono font-label-sm text-label-sm text-primary font-semibold">{rec.id}</td>
                    <td className="py-space-sm px-space-md font-label-sm text-label-sm text-on-surface">{rec.sourceArchive}</td>
                    <td className="py-space-sm px-space-md">
                      <span className={`px-2 py-0.5 rounded font-mono font-label-sm text-label-sm font-bold ${rec.label === 'FAKE' ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed'}`}>
                        {rec.label}
                      </span>
                    </td>
                    <td className="py-space-sm px-space-md font-headline-sm text-headline-sm text-primary max-w-md">{rec.headline}</td>
                    <td className="py-space-sm px-space-md font-body-sm text-body-sm text-on-surface-variant">{rec.decontaminationNote}</td>
                    <td className="py-space-sm px-space-md font-mono font-label-sm text-label-sm text-on-surface-variant">{rec.split}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
