import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CircleUserRound,
  Database,
  Download,
  FileJson,
  FileSearch,
  Filter,
  Flag,
  Gauge,
  GitBranch,
  Info,
  ListChecks,
  PlayCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Moon,
  Sun,
  TerminalSquare,
  Workflow,
  Zap,
} from 'lucide-react';

type View = 'analyzer' | 'benchmark';
type Theme = 'light' | 'dark';
type PresetKey = 'routine' | 'election' | 'health' | 'financial';

const presets: Record<PresetKey, { headline: string; body: string }> = {
  routine: {
    headline: 'Treasury Department Announces Quarterly Refunding Schedule and Bond Issuance Targets',
    body: 'The U.S. Department of the Treasury today announced its current estimates of net marketable borrowing for the January through March 2024 quarter. According to official public statements released via the Office of Debt Management, institutional yields remain closely aligned with Federal Reserve benchmark guidance.',
  },
  election: {
    headline: 'BREAKING: Secret Classified Briefing Reveals Fabricated Tech Breakthrough Suppressed by Officials',
    body: 'BREAKING: Shocking clandestine documents obtained through an unnamed insider prove that high-level authorities intentionally concealed an extraordinary scientific revolution. Insiders confirm that multiple agencies silently admitted in private sessions that the breakthrough would destabilize their economic grip on traditional infrastructure.\n\nReliable sources close to the inner circle now claim the evidence is conclusive, though regulatory bodies refuse to issue formal denials or confirm the timeline. Mainstream networks have enforced total radio silence surrounding the astonishing leaked memos.\n\nCritics and whistleblowers warn that this massive coverup threatens millions of citizens unless alternative independent reporting forces transparent declassification before midnight.',
  },
  health: {
    headline: 'Renowned Biologist Uncovers Miracle Household Tonic That Eliminates Cellular Aging Overnight',
    body: 'A rogue medical researcher who was banned from academic symposiums has finally released the formula Big Pharma tried to suppress for thirty years. According to unverified private trials, drinking this proprietary salt mixture will completely eradicate biological deterioration in mere days without clinical prescription.',
  },
  financial: {
    headline: 'Federal Reserve Holds Benchmark Overnight Rate at 5.25% - 5.50% Following FOMC Meeting',
    body: 'The Federal Open Market Committee decided unanimously at its scheduled statutory meeting today to maintain the target range for the federal funds rate at 5.25% to 5.50%. Committee members noted that job gains have moderated while inflation has eased over the past twelve months, though remaining above the statutory two percent target.',
  },
};

const initialHeadline = presets.election.headline;
const initialBody = presets.election.body;

function App() {
  const [view, setView] = useState<View>('analyzer');
  const [headline, setHeadline] = useState(initialHeadline);
  const [body, setBody] = useState(initialBody);
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text');
  const [toast, setToast] = useState('Telemetry data exported to clipboard.');
  const [scanning, setScanning] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3000);
  };

  const loadPreset = (key: PresetKey) => {
    setHeadline(presets[key].headline);
    setBody(presets[key].body);
    notify(`Preset loaded: ${key.toUpperCase()}`);
  };

  const runScan = () => {
    setScanning(true);
    window.setTimeout(() => {
      setScanning(false);
      notify('Ensemble verification complete: 89.4% fake risk');
    }, 700);
  };

  return (
    <div className={`app-shell theme-${theme}`}>
      <Header view={view} setView={setView} theme={theme} toggleTheme={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} />
      {view === 'analyzer' ? (
        <Analyzer
          headline={headline}
          body={body}
          setHeadline={setHeadline}
          setBody={setBody}
          inputMode={inputMode}
          setInputMode={setInputMode}
          loadPreset={loadPreset}
          runScan={runScan}
          scanning={scanning}
          notify={notify}
        />
      ) : (
        <Benchmark notify={notify} />
      )}
      <Footer />
      {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  );
}

function Header({ view, setView, theme, toggleTheme }: { view: View; setView: (view: View) => void; theme: Theme; toggleTheme: () => void }) {
  return (
    <header className="site-header">
      <div className="header-main page-width">
        <div className="brand-wrap">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='27' fill='%23f9f9ff' stroke='%23131a33' stroke-width='6'/%3E%3Ccircle cx='32' cy='32' r='19' fill='none' stroke='%23069669' stroke-width='4' stroke-dasharray='4 7'/%3E%3Cpath d='M32 8v12M32 44v12M8 32h12M44 32h12' stroke='%23131a33' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='m32 18 6 14-6 14-6-14z' fill='%23ba1a1a'/%3E%3Ccircle cx='32' cy='32' r='4' fill='%23069669' stroke='%23131a33' stroke-width='2'/%3E%3C/svg%3E" alt="TruthLens compass" className="brand-mark" />
          <div className="brand-copy"><strong>TruthLens</strong><span>Editorial Intelligence</span></div>
          <span className="live-pill"><i /> Live verification engine (WELFake 72K)</span>
        </div>
        <div className="header-meta">
          <span className="meta-chip">Checkpoint: <b>v2.8.4-release</b></span>
          <span className="meta-chip">Latency: <b>18ms avg</b></span>
          <span className="docs-link">Docs</span>
          <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
          <CircleUserRound className="user-icon" size={18} />
        </div>
      </div>
      <div className="nav-row">
        <nav className="page-width nav-inner">
          <button className={view === 'analyzer' ? 'active' : ''} onClick={() => setView('analyzer')}>Article &amp; URL Analyzer</button>
          <button className={view === 'benchmark' ? 'active' : ''} onClick={() => setView('benchmark')}>Model Benchmark Matrix</button>
          <button>Dataset Transparency &amp; Pipeline</button>
          <button>API &amp; Export</button>
          <div className="telemetry">Latest telemetry: <b>Claim #84920 [Corroborated 98.4%]</b><span>•</span><b>Reuters-ingest [Valid]</b><span>•</span><em>Src-drift detected [P-A clf: 81.2%]</em></div>
        </nav>
      </div>
    </header>
  );
}

function Analyzer({ headline, body, setHeadline, setBody, inputMode, setInputMode, loadPreset, runScan, scanning, notify }: {
  headline: string; body: string; setHeadline: (value: string) => void; setBody: (value: string) => void;
  inputMode: 'text' | 'url'; setInputMode: (mode: 'text' | 'url') => void; loadPreset: (key: PresetKey) => void;
  runScan: () => void; scanning: boolean; notify: (message: string) => void;
}) {
  const [strict, setStrict] = useState(true);
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  return (
    <main>
      <div className="diagnostic-strip"><div className="page-width diagnostic-inner"><span><i className="pulse-dot red" /> Chamber ingestion buffer: <b>Session #TL-9942-WELFAKE</b> <small>• Vector weight: scaling active</small></span><span>Target vocab: <b>WELFake-72.1K</b> &nbsp; Ensemble: <strong> synchronized (3/3)</strong></span></div></div>
      <section className="title-band"><div className="page-width title-layout"><div><div className="eyebrow"><span>Forensic Workbench</span> / Real-time natural language inference</div><h1>Investigative Fact Verification &amp; Linguistic Deception Detection</h1><p>Multi-model consensus analysis trained on 72,134 verified news articles (WELFake benchmark). Evaluates linguistic patterns, sensationalism ratios, and source provenance across independent classification weights.</p></div><div className="shield-badge"><ShieldCheck size={17} /> Editorial Shield 99.8% Calibrated<small>Last pipeline retrain: 04:12 UTC today</small></div></div></section>
      <div className="page-width workspace">
        <div className="workspace-grid">
          <section className="stack">
            <div className="card chamber">
              <div className="mode-bar"><div className="segmented"><button className={inputMode === 'text' ? 'selected' : ''} onClick={() => setInputMode('text')}><TerminalSquare size={15} />Paste Raw Article / Headline</button><button className={inputMode === 'url' ? 'selected' : ''} onClick={() => setInputMode('url')}><Search size={15} />Scrape Live URL (Auto-Extract)</button></div><span className="auto-token"><Sliders /> Auto-tokenize: on</span></div>
              <div className="preset-area"><label>Quick benchmark preset archetypes:</label><div className="preset-list"><button onClick={() => loadPreset('routine')}><i className="green-dot" />Routine policy update (True)</button><button className="selected-preset" onClick={() => loadPreset('election')}><i className="red-dot" />Sensational election claim (High Suspicion)</button><button onClick={() => loadPreset('health')}><i className="red-dot" />Unverified health miracle (Fabricated)</button><button onClick={() => loadPreset('financial')}><i className="green-dot" />Financial quarterly release (True)</button></div></div>
              {inputMode === 'url' && <div className="url-input"><label>Live dispatch or article URL</label><div><span>$ fetch://</span><input placeholder="https://wire.reuters.com/investigations/article-84920" /><button onClick={() => notify('Live URL extraction queued')}>Extract copy</button></div></div>}
              <div className="form-area"><div className="field"><div className="field-head"><label>Target headline or cable subject</label><span>{headline.length} / 180 chars</span></div><input value={headline} onChange={(event) => setHeadline(event.target.value)} /></div><div className="field"><div className="field-head"><label>Body copy &amp; ingested lead paragraphs</label><span>Tokens: {wordCount} &nbsp;•&nbsp; Sentences: {body.split(/[.!?]+/).filter(Boolean).length}</span></div><textarea rows={9} value={body} onChange={(event) => setBody(event.target.value)} /></div><div className="config-row"><div className="select-group"><label>Inference ensemble</label><select><option>Consensus Ensemble (Tri-Model 72k)</option><option>Logistic Regression (L2 Regularized)</option><option>Random Forest Classifier (300 Trees)</option></select></div><div className="select-group"><label>TF-IDF N-Gram scope</label><select><option>Unigram + Bigram (1, 2)</option><option>Strict Bigrams (2, 2)</option><option>Deep Trigrams (1, 3)</option></select></div><label className="checkbox"><input type="checkbox" checked={strict} onChange={(event) => setStrict(event.target.checked)} /> Strict sensationalism weights</label></div><div className="action-row"><span><Info size={15} /> WELFake-72K cross-validated (Precision: 0.94)</span><div><button className="secondary-btn" onClick={() => { setHeadline(''); setBody(''); notify('Chamber input cleared'); }}>Reset chamber</button><button className="primary-btn" onClick={runScan} disabled={scanning}>{scanning ? <><RefreshCw className="spin" size={16} />Processing vectors...</> : <><Zap size={16} />Run verification scan <kbd>⌘+Enter</kbd></>}</button></div></div></div>
            </div>
            <Evidence />
          </section>
          <AnalyzerReport notify={notify} />
        </div>
        <Sequence />
      </div>
    </main>
  );
}

function Sliders() { return <Filter size={14} />; }

function Evidence() {
  return <div className="card evidence"><div className="section-head"><span><FileSearch size={17} /> Semantic deception mapping &amp; lexical flagging</span><strong>4 critical anomalies identified</strong></div><p className="muted">Hover over colored spans to examine contextual risk metrics and deceptive attribution signatures:</p><div className="annotated-text"><mark>BREAKING: Shocking clandestine documents</mark> obtained through an <mark className="neutral-mark">unnamed insider</mark> prove that high-level authorities intentionally concealed an extraordinary scientific revolution. Insiders confirm that multiple agencies <mark>silently admitted in private sessions</mark> that the breakthrough would destabilize their economic grip on traditional infrastructure. Reliable sources close to the inner circle now claim the evidence is conclusive... Whistleblowers warn that this <mark>massive coverup threatens millions</mark> of citizens unless alternative reporting acts immediately.</div><div className="legend"><span><i className="legend-red" /> Fabrication / sensationalism</span><span><i className="legend-blue" /> Unverified / disputed citation</span><span><i className="legend-pale" /> Corroborated baseline</span></div></div>;
}

function AnalyzerReport({ notify }: { notify: (message: string) => void }) {
  const models = [['Logistic Regression (TF-IDF Weight)', '91.2%', '14ms', 91.2], ['Random Forest (Tree Ensemble)', '86.8%', '28ms', 86.8], ['Passive Aggressive (News Stream Drift)', '90.3%', '11ms', 90.3]] as const;
  return <section className="stack report"><div className="verdict-card"><div className="verdict-header"><span><AlertTriangle size={18} /> Primary verdict engine</span><b>Status: Critical</b></div><div className="verdict-body"><div><label>Calculated risk index</label><div className="risk-number">89.4% <small>deception probability</small></div><h3>Highly unreliable / sensationalist</h3></div><div className="dial"><svg viewBox="0 0 36 36"><path d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831a15.9155 15.9155 0 0 0 0-31.831" /><path className="dial-progress" strokeDasharray="89.4, 100" d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831a15.9155 15.9155 0 0 0 0-31.831" /></svg><b>89.4%</b><small>alert</small></div><div className="recommendation"><AlertTriangle size={18} /><span><b>Recommendation: Hold publication &amp; flag</b>Severe syntactic manipulation markers and lack of corroborative citations exceed threshold (85.0%). Requires human editorial oversight.</span></div><div className="mini-stats"><div>Confidence interval:<b>94.2% (±1.8%)</b></div><div>WELFake corpus similarity:<b className="red-text">97.1% match</b></div></div></div></div><div className="card report-card"><div className="section-head"><span><GitBranch size={17} /> Tri-model ensemble consensus</span><strong className="green-text">3/3 full unanimity</strong></div>{models.map(([name, score, time, width]) => <div className="model-row" key={name}><div><b>{name}</b><span>{time}</span><strong>{score} fake</strong></div><div className="progress"><i style={{ width: `${width}%` }} /></div><small>Features: 20,000 N-Grams <span>Decision plane: +2.84 Sigma</span></small></div>)}</div><div className="card diagnostics"><div className="section-head"><span>Stylometric diagnostics</span><small>4 vectors</small></div>{[['Emotional hyperbole index', '88%', 'critical', 'red'], ['Clickbait syntax frequency', '76%', 'high', 'red'], ['Verifiable source citations', '12%', 'lacking', 'red'], ['Unattributed passive claims', '64%', 'elevated', 'blue']].map(([name, value, label, color]) => <div className="diagnostic" key={name}><div><span>{name}</span><b className={color === 'red' ? 'red-text' : ''}>{value} ({label})</b></div><div className={`progress ${color}`}><i style={{ width: value }} /></div></div>)}</div><div className="card export-row"><label>Archival exports &amp; whistleblower chain:</label><div><button onClick={() => notify('Generating encrypted broadsheet PDF dossier...')}><Download size={15} />Forensic PDF</button><button onClick={() => notify('Forensic JSON telemetry copied to clipboard')}><FileJson size={15} />Copy JSON</button><button className="danger-btn" onClick={() => notify('Article ingest flagged in verification database')}><Flag size={15} />Flag to DB</button></div></div></section>;
}

function Sequence() {
  const steps = [['Phase 01', 'Linguistic Normalization', 'Stopword exclusion, regex sanitization, lemmatization, and headline capitalization variance extraction.', 'Avg: 2.4ms per cycle', Filter], ['Phase 02', 'TF-IDF Vector Space', 'Projection into 20,000 sub-linear term frequency dimensions with unigram and bigram token weighting.', '20,000 dimensions', Workflow], ['Phase 03', 'Tri-Model Ensemble', 'Independent evaluation by Logistic Regression, Random Forest, and Passive Aggressive classifiers.', 'Ensemble consensus: 100%', GitBranch], ['Phase 04', 'Editorial Scorecard', 'Hyperbole correlation, source attribution density, and cryptographically verified JSON telemetry log.', 'SHA-256 ledger stamp', ListChecks]] as const;
  return <section className="sequence"><div className="section-head"><h2><Workflow size={19} /> Inference execution sequence</h2><small>WELFake Architecture Specification v2.8</small></div><div className="sequence-grid">{steps.map(([phase, title, description, meta, Icon]) => <div className="sequence-card" key={phase}><div><b>{phase}</b><Icon size={18} /></div><h3>{title}</h3><p>{description}</p><small>{meta}</small></div>)}</div></section>;
}

function Benchmark({ notify }: { notify: (message: string) => void }) {
  const [filter, setFilter] = useState<'all' | 'fake' | 'true'>('all');
  const [sandbox, setSandbox] = useState('');
  const sandboxScore = useMemo(() => {
    const text = sandbox.toLowerCase();
    if (!text.trim()) return null;
    const fake = ['unbelievable', 'shocking', 'insider', 'leaked', 'miracle', 'silent', 'panic'].filter((term) => text.includes(term)).length;
    const verified = ['spokesperson', 'reuters', 'official', 'statement', 'prosecutors', 'quarterly', 'confirmed'].filter((term) => text.includes(term)).length;
    return fake > verified ? { label: 'Fabricated indicators', score: Math.min(99, 78 + fake * 6), tone: 'red' } : verified > fake ? { label: 'Corroborated tone', score: Math.min(99, 82 + verified * 5), tone: 'green' } : { label: 'Inconclusive / neutral', score: 50, tone: 'blue' };
  }, [sandbox]);
  const rows = [
    ['Logistic Regression', 'TF-IDF (1,2-grams)', '92.4%', '91.8%', '93.1%', '0.924', 'Infer: 11.4ms', 'High-throughput ingestion wire, low-memory edge containers.', 'blue'],
    ['Random Forest', 'Subword N-Grams', '94.1%', '95.2%', '92.7%', '0.939', 'Infer: 38.9ms', 'Deep non-linear stylistic forensics, legal dispute audits.', 'green'],
    ['Passive Aggressive', 'TF-IDF Word + Stylometry', '93.8%', '93.4%', '94.2%', '0.938', 'Infer: 14.8ms', 'Dynamic stream adaptation, continuous breaking news calibration.', 'navy'],
  ];
  return <main><div className="page-width benchmark-page"><div className="benchmark-title"><div><div className="eyebrow"><span>Benchmark Matrix // Audit #WL-72K</span> <b className="green-text"><i className="green-dot" /> Evaluation suite verified</b></div><h1>Machine Learning Model Benchmarks &amp; WELFake Validation Matrix</h1><p>Comparative evaluation of scikit-learn classifiers on 72,134 balanced true and fabricated news records. Transparent performance across accuracy, precision, recall, and inference latency.</p></div><div className="title-actions"><button className="secondary-btn" onClick={() => notify('CSV export prepared: WELFake_72K_Scikit_Matrix.csv')}><Download size={15} /> Raw CSV (68MB)</button><button className="primary-btn" onClick={() => notify('Harness 100% healthy')}><PlayCircle size={15} /> Run test harness</button></div></div><div className="stat-grid"><Stat icon={Database} label="Corpus volume" value="72,134" detail="WELFake balanced records" foot="37,106 true / 35,028 fake" accent="green" /><Stat icon={ShieldCheck} label="Ensemble accuracy" value="93.8%" detail="Weighted harmonic F1: 0.934" foot="5-fold stratified CV" accent="blue" /><Stat icon={Gauge} label="Inference speed" value="17.6ms" detail="Per 1,000 word dispatch" foot="P99 peak: 31.2ms" accent="blue" /><Stat icon={AlertTriangle} label="False positive rate" value="4.2%" detail="Editorial threshold: 0.85 P" foot="Prevents false accusation" accent="red" /></div><div className="card matrix-card"><div className="section-head"><div><label>Primary architecture breakdown</label><h2>Model comparison matrix &amp; latency profiles</h2></div><div className="filter-tabs">{(['all', 'fake', 'true'] as const).map((item) => <button className={filter === item ? 'selected' : ''} key={item} onClick={() => setFilter(item)}>{item === 'all' ? 'All metrics' : `Class '${item}'`}</button>)}</div></div><div className="table-scroll"><table><thead><tr><th>Model architecture</th><th>Feature representation</th><th>Accuracy</th><th>Precision (fake)</th><th>Recall (fake)</th><th>F1-score</th><th>Train / cold latency</th><th>Optimal editorial use-case</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}><td><div className="model-name"><i className={row[8]} /><div><b>{row[0]}</b><small>sklearn classifier • tuned baseline</small></div></div></td><td><span className="tag">{row[1]}</span><small>50,000 max features</small></td><td><b className={row[8] === 'green' ? 'green-text' : ''}>{row[2]}</b><div className="tiny-progress"><i className={row[8]} style={{ width: row[2] }} /></div></td><td>{row[3]}</td><td>{row[4]}</td><td><span className="score-tag">{row[5]}</span></td><td><small>Train: 41.2s</small><small className="green-text">{row[6]}</small></td><td><small>{row[7]}</small></td></tr>)}</tbody></table></div><div className="table-note"><Info size={17} /> Metrics evaluated on an isolated 20% holdout split (14,427 items) strictly quarantined prior to TF-IDF vocabulary fitting. <span>Hardware: AWS c6i.2xlarge</span></div></div><Predictors /><PipelineSandbox sandbox={sandbox} setSandbox={setSandbox} score={sandboxScore} /></div></main>;
}

function Stat({ icon: Icon, label, value, detail, foot, accent }: { icon: typeof Database; label: string; value: string; detail: string; foot: string; accent: string }) { return <div className={`stat-card ${accent}`}><div><span>{label}</span><Icon size={18} /><b>{value}</b><small>{detail}</small></div><footer>{foot}<strong>●</strong></footer></div>; }

function Predictors() {
  const fake = ['unbelievable', "they don't want you to know", 'shocking truth', 'insider leaked', 'miracle cure', 'mainstream media silent', 'bombshell revelation', 'proof of conspiracy', 'wake up people', 'covert operation'];
  const trueTerms = ['spokesperson said', 'according to Reuters', 'official data showed', 'confirmed by', 'quarterly earnings', 'in a statement on', 'federal prosecutors', 'peer-reviewed study', 'regulatory filing', 'defense department'];
  return <section className="predictors"><div><label>Interpretability &amp; vocabulary weights</label><h2>Top Differential Lexical Predictors (TF-IDF Coeffs)</h2></div><div className="predictor-grid"><Predictor title="Deceptive / Fabricated Association" terms={fake} tone="red" /><Predictor title="Corroborated / Verified Association" terms={trueTerms} tone="green" /></div></section>;
}

function Predictor({ title, terms, tone }: { title: string; terms: string[]; tone: 'red' | 'green' }) { return <div className="card predictor-card"><h3><i className={tone} />{title}</h3><p>Strong linguistic markers signaling {tone === 'red' ? 'hyperbole, urgent conspiratorial assertion, and deliberate absence of attributed institutional sourcing.' : 'disciplined wire services: indirect quotation verbs, named agency references, and empirical institutional indicators.'}</p>{terms.map((term, index) => <div className="predictor-line" key={term}><span>{index + 1}. “{term}”</span><div className="tiny-progress"><i className={tone} style={{ width: `${98 - index * 5}%` }} /></div><b className={`${tone}-text`}>{tone === 'red' ? '+' : '-'}{(4.82 - index * 0.21).toFixed(2)}</b></div>)}</div>; }

function PipelineSandbox({ sandbox, setSandbox, score }: { sandbox: string; setSandbox: (value: string) => void; score: { label: string; score: number; tone: string } | null }) { return <div className="card sandbox"><div className="section-head"><div><label>Live model sanity check</label><h2>Real-time in-browser inference test harness</h2></div><div><button onClick={() => setSandbox('Unbelievable shocking truth revealed! An insider leaked covert operation secrets that mainstream media is totally silent on.')}>Load fabricated sample</button><button onClick={() => setSandbox('A spokesperson said in an official statement on Thursday that federal prosecutors have opened an inquiry, according to Reuters.')}>Load Reuters sample</button></div></div><div className="sandbox-grid"><div><label>Input test copy (paragraph or headline + lead):</label><textarea rows={5} value={sandbox} onChange={(event) => setSandbox(event.target.value)} placeholder="Paste news article excerpts to witness the ensemble weights calculate dynamically..." /><small>{sandbox.trim() ? sandbox.trim().split(/\s+/).length : 0} words / {sandbox.length} characters</small></div><div className="sandbox-output"><label>Real-time ensemble output</label><h3 className={score ? `${score.tone}-text` : ''}>{score?.label ?? 'Awaiting input'}</h3><div className="big-progress"><i className={score ? score.tone : 'blue'} style={{ width: `${score?.score ?? 0}%` }} /></div><div className="output-list"><span>Logistic Regression: <b>{score ? `${score.score - 2.1}%` : '--'}</b></span><span>Random Forest (100t): <b>{score ? `${score.score + 1.4}%` : '--'}</b></span><span>Passive Aggressive: <b>{score ? `${score.score - 0.7}%` : '--'}</b></span><strong>Ensemble confidence: {score ? `${score.score}%` : '--'}</strong></div></div></div></div>; }

function Footer() { return <footer className="site-footer"><div className="page-width"><b>TruthLens</b><span>© 2024 Editorial Forensic Laboratory. Rigorous broadsheet veracity instrumentation.</span><span>WELFake 72,134 Corroborated Tokens</span><span>Triple-Model Consensus</span><span>Journalistic Disclosures</span></div></footer>; }

export default App;
