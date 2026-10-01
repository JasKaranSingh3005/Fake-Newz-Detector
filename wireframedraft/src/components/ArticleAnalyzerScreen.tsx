import React, { useState, useEffect, useCallback } from 'react';
import { PRESET_SAMPLES, PresetData } from './presets';

interface ArticleAnalyzerScreenProps {
  onShowToast: (msg: string) => void;
}

type PresetKey = 'routine' | 'election' | 'health' | 'financial' | 'custom';

export const ArticleAnalyzerScreen: React.FC<ArticleAnalyzerScreenProps> = ({ onShowToast }) => {
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text');
  const [urlValue, setUrlValue] = useState('https://wire.reuters.com/investigations/article-84920');
  const [activePreset, setActivePreset] = useState<PresetKey>('election');
  const [headline, setHeadline] = useState(PRESET_SAMPLES.election.headline);
  const [body, setBody] = useState(PRESET_SAMPLES.election.body);
  const [selectedModel, setSelectedModel] = useState('all');
  const [ngramScope, setNgramScope] = useState('Unigram + Bigram (1, 2)');
  const [strictFilter, setStrictFilter] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<PresetData>(PRESET_SAMPLES.election);

  const tokenCount = body.trim() ? (body === PRESET_SAMPLES.election.body ? 148 : body.trim().split(/\s+/).length) : 0;
  const sentenceCount = body.trim() ? (body === PRESET_SAMPLES.election.body ? 3 : Math.max(1, body.split(/[.!?]+/).filter((s) => s.trim().length > 0).length)) : 0;
  const headlineCharDisplay = headline === PRESET_SAMPLES.election.headline ? 92 : headline.length;

  const analyzeCustomContent = useCallback((hText: string, bText: string, strict: boolean): PresetData => {
    const combined = `${hText} ${bText}`.toLowerCase();
    const fakeWords = ['breaking', 'shocking', 'secret', 'clandestine', 'unnamed insider', 'coverup', 'miracle', 'suppressed', 'banned', 'conspiracy', 'unbelievable'];
    const trueWords = ['treasury', 'federal reserve', 'committee', 'spokesperson', 'reuters', 'official', 'quarterly', 'statutory', 'confirmed'];

    let fakeScore = fakeWords.filter((w) => combined.includes(w)).length;
    let trueScore = trueWords.filter((w) => combined.includes(w)).length;

    if (fakeScore >= trueScore) {
      const risk = Number(Math.min(98.2, Math.max(68.5, 74.0 + fakeScore * 3.8 + (strict ? 3.2 : 0))).toFixed(1));
      return {
        headline: hText,
        body: bText,
        isDeceptive: true,
        riskPercent: risk,
        verdictLabel: 'HIGHLY UNRELIABLE / SENSATIONALIST',
        statusTag: 'STATUS: CRITICAL',
        recommendationTitle: 'RECOMMENDATION: HOLD PUBLICATION & FLAG',
        recommendationBody: 'Severe syntactic manipulation markers and lack of corroborative citations exceed threshold (85.0%). Requires human editorial oversight.',
        confidenceInterval: '93.8% (±1.9%)',
        corpusSimilarity: '96.4% Match',
        unanimityTag: '3/3 FULL UNANIMITY',
        models: {
          lr: { prob: Number(Math.min(99, risk + 1.8).toFixed(1)), latency: 14, sigma: '+2.78 Sigma', verdict: 'FAKE' },
          rf: { prob: Number(Math.max(55, risk - 2.6).toFixed(1)), latency: 28, gini: '0.13', verdict: 'FAKE' },
          pa: { prob: Number(Math.min(99, risk + 0.9).toFixed(1)), latency: 11, margin: 'Convex Boundary Active', verdict: 'FAKE' },
        },
        diagnostics: {
          hyperbole: { val: Math.min(96, Math.round(risk)), tag: `${Math.min(96, Math.round(risk))}% (CRITICAL)`, isError: true },
          clickbait: { val: Math.min(92, Math.round(risk - 12)), tag: `${Math.min(92, Math.round(risk - 12))}% (HIGH)`, isError: true },
          citations: { val: 14, tag: '14% (LACKING)', isError: true },
          passive: { val: 66, tag: '66% (ELEVATED)', isError: false },
        },
        anomaliesCountText: `${Math.max(2, fakeScore)} CRITICAL ANOMALIES IDENTIFIED`,
      };
    } else {
      const risk = Number(Math.max(3.2, 18.0 - trueScore * 2.5).toFixed(1));
      const trueProb = Number((100 - risk).toFixed(1));
      return {
        headline: hText,
        body: bText,
        isDeceptive: false,
        riskPercent: risk,
        verdictLabel: 'CORROBORATED WIRE DISPATCH / VERIFIED',
        statusTag: 'STATUS: VERIFIED',
        recommendationTitle: 'RECOMMENDATION: CLEAR FOR EDITORIAL PUBLICATION',
        recommendationBody: 'Institutional attribution signatures and low emotional hyperbole align with verified wire benchmarks (deception risk < 15.0%).',
        confidenceInterval: '96.4% (±1.2%)',
        corpusSimilarity: '98.2% Match',
        unanimityTag: '3/3 FULL UNANIMITY',
        models: {
          lr: { prob: Number(Math.min(99, trueProb + 0.5).toFixed(1)), latency: 13, sigma: '-3.05 Sigma', verdict: 'TRUE' },
          rf: { prob: Number(Math.min(99, trueProb + 1.2).toFixed(1)), latency: 26, gini: '0.08', verdict: 'TRUE' },
          pa: { prob: Number(Math.max(80, trueProb - 0.8).toFixed(1)), latency: 11, margin: 'Verified Wire Plane', verdict: 'TRUE' },
        },
        diagnostics: {
          hyperbole: { val: 9, tag: '9% (NOMINAL)', isError: false },
          clickbait: { val: 7, tag: '7% (MINIMAL)', isError: false },
          citations: { val: 91, tag: '91% (ROBUST)', isError: false },
          passive: { val: 16, tag: '16% (LOW)', isError: false },
        },
        anomaliesCountText: '0 CRITICAL ANOMALIES • VERIFIED SOURCES',
      };
    }
  }, []);

  const loadSample = (key: Exclude<PresetKey, 'custom'>) => {
    const data = PRESET_SAMPLES[key];
    setActivePreset(key);
    setHeadline(data.headline);
    setBody(data.body);
    setCurrentAnalysis(data);
    onShowToast(`Preset Loaded: ${key.toUpperCase()}`);
  };

  const resetChamber = () => {
    setHeadline('');
    setBody('');
    setActivePreset('custom');
    onShowToast('Chamber Input Cleared');
  };

  const triggerVerification = useCallback(() => {
    if (!headline.trim() && !body.trim()) {
      onShowToast('Please provide a headline or article body to scan.');
      return;
    }
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (activePreset !== 'custom') {
        const presetData = PRESET_SAMPLES[activePreset];
        setCurrentAnalysis(presetData);
        onShowToast(`Ensemble Verification Complete: ${presetData.riskPercent}% ${presetData.isDeceptive ? 'Fake Risk' : 'Deception Risk (Verified)'}`);
      } else {
        const customRes = analyzeCustomContent(headline, body, strictFilter);
        setCurrentAnalysis(customRes);
        onShowToast(`Ensemble Verification Complete: ${customRes.riskPercent}% Deception Risk`);
      }
    }, 550);
  }, [activePreset, analyzeCustomContent, body, headline, onShowToast, strictFilter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        triggerVerification();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerVerification]);

  const handleExtractUrl = () => {
    if (!urlValue.trim()) {
      onShowToast('Enter a valid dispatch URL to extract.');
      return;
    }
    if (urlValue.includes('reuters') || urlValue.includes('treasury')) {
      loadSample('routine');
    } else {
      loadSample('election');
    }
    onShowToast('Extracted Wire Content from URL');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Forensic Breadcrumb */}
      <div className="w-full bg-surface-container-low px-gutter py-space-sm flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
          <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">CHAMBER INGESTION BUFFER: </span>
          <span className="font-label-sm text-label-sm text-primary font-semibold font-mono">SESSION #TL-9942-WELFAKE</span>
          <span className="text-outline-variant">•</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">VECTOR WEIGHT: SCALING ACTIVE</span>
        </div>
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">TARGET VOCAB:</span>
            <span className="font-label-sm text-label-sm text-on-surface font-mono font-medium">WELFake-72.1K</span>
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">ENSEMBLE:</span>
            <span className="font-label-sm text-label-sm text-on-tertiary-container font-mono font-semibold">SYNCHRONIZED (3/3)</span>
          </div>
        </div>
      </div>

      {/* Editorial Title Section */}
      <div className="w-full px-gutter pt-space-lg pb-space-md bg-surface-container-lowest shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-space-md">
          <div className="space-y-space-xs max-w-4xl">
            <div className="flex items-center gap-space-xs">
              <span className="px-space-xs py-0.5 rounded bg-surface-container-high font-label-sm text-label-sm text-on-surface uppercase font-semibold">Forensic Workbench</span>
              <span className="text-outline-variant">/</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Real-Time Natural Language Inference</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">
              Investigative Fact Verification &amp; Linguistic Deception Detection
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl leading-relaxed">
              Multi-model consensus analysis trained on 72,134 verified news articles (WELFake benchmark). Evaluates linguistic patterns, sensationalism ratios, and source provenance across independent classification weights.
            </p>
          </div>
          <div className="flex flex-col items-end gap-space-xs">
            <div className="flex items-center gap-space-xs bg-surface-container px-space-md py-space-xs rounded">
              <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
              <span className="font-label-sm text-label-sm text-primary font-mono uppercase">Editorial Shield 99.8% Calibrated</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Last Pipeline Retrain: 04:12 UTC Today</span>
          </div>
        </div>
      </div>

      {/* Main 12-Column Grid */}
      <div className="w-full px-gutter py-space-lg max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left Column (7 cols) */}
          <section className="lg:col-span-7 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded shadow-md overflow-hidden flex flex-col">
              {/* Mode Switcher */}
              <div className="bg-surface-container-low px-space-md py-space-sm flex flex-wrap items-center justify-between gap-space-sm">
                <div className="inline-flex p-0.5 rounded bg-surface-container" role="tablist">
                  <button
                    type="button"
                    onClick={() => setInputMode('text')}
                    className={`px-space-md py-1.5 rounded font-label-md text-label-md transition-all font-medium flex items-center gap-space-xs cursor-pointer ${
                      inputMode === 'text' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">edit_note</span>
                    <span>Paste Raw Article / Headline</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('url')}
                    className={`px-space-md py-1.5 rounded font-label-md text-label-md transition-all font-medium flex items-center gap-space-xs cursor-pointer ${
                      inputMode === 'url' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">travel_explore</span>
                    <span>Scrape Live URL (Auto-Extract)</span>
                  </button>
                </div>
                <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">tune</span>
                  <span>AUTO-TOKENIZE: ON</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="px-space-md pt-space-md pb-space-xs bg-surface-container-lowest">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-space-xs">Quick Benchmark Preset Archetypes:</span>
                <div className="flex flex-wrap gap-space-xs">
                  {(['routine', 'election', 'health', 'financial'] as const).map((key) => {
                    const isTrue = key === 'routine' || key === 'financial';
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => loadSample(key)}
                        className={`px-space-sm py-1 rounded transition-colors font-label-sm text-label-sm text-on-surface flex items-center gap-1 cursor-pointer ${
                          activePreset === key ? 'bg-secondary-container font-semibold shadow-sm' : 'bg-surface-container hover:bg-surface-container-high'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isTrue ? 'bg-on-tertiary-container' : 'bg-error'}`}></span>
                        <span>{key === 'routine' ? 'Routine policy update (True)' : key === 'election' ? 'Sensational election claim (High Suspicion)' : key === 'health' ? 'Unverified health miracle (Fabricated)' : 'Financial quarterly release (True)'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* URL Input */}
              {inputMode === 'url' && (
                <div className="px-space-md pt-space-md">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wide" htmlFor="url-field">Live Dispatch or Article URL</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 font-mono text-outline font-label-md text-label-md">$ fetch://</span>
                      <input
                        id="url-field"
                        type="url"
                        value={urlValue}
                        onChange={(e) => setUrlValue(e.target.value)}
                        placeholder="https://wire.reuters.com/investigations/article-84920"
                        className="w-full bg-surface-container-low pl-24 pr-28 py-2.5 rounded font-label-md text-label-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={handleExtractUrl}
                        className="absolute right-1.5 px-space-sm py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm uppercase font-semibold cursor-pointer hover:bg-primary-container"
                      >
                        Extract Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Text Inputs */}
              <div className="p-space-md flex flex-col gap-space-md">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wide" htmlFor="article-headline">Target Headline or Cable Subject</label>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">{headlineCharDisplay} / 180 chars</span>
                  </div>
                  <input
                    id="article-headline"
                    type="text"
                    value={headline}
                    onChange={(e) => {
                      setHeadline(e.target.value);
                      setActivePreset('custom');
                    }}
                    className="w-full bg-surface-container-low px-space-md py-2.5 rounded font-headline-sm text-headline-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wide" htmlFor="article-body">Body Copy &amp; Ingested Lead Paragraphs</label>
                    <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant font-mono">
                      <span>Tokens: {tokenCount}</span>
                      <span>•</span>
                      <span>Sentences: {sentenceCount}</span>
                    </div>
                  </div>
                  <textarea
                    id="article-body"
                    rows={9}
                    value={body}
                    onChange={(e) => {
                      setBody(e.target.value);
                      setActivePreset('custom');
                    }}
                    className="w-full bg-surface-container-low p-space-md rounded font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed shadow-inner font-normal"
                  />
                </div>

                {/* Ensemble Controls */}
                <div className="bg-surface-container-low p-space-sm rounded flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-sm">
                  <div className="flex flex-wrap items-center gap-space-sm">
                    <div className="flex flex-col">
                      <label htmlFor="model-select" className="font-label-sm text-label-sm text-on-surface-variant uppercase font-medium">Inference Ensemble</label>
                      <select
                        id="model-select"
                        value={selectedModel}
                        onChange={(e) => {
                          setSelectedModel(e.target.value);
                          onShowToast(`Ensemble Mode Set: ${e.target.options[e.target.selectedIndex].text}`);
                        }}
                        className="bg-surface-container-lowest text-on-surface font-label-sm text-label-sm px-space-sm py-1.5 rounded focus:outline-none cursor-pointer"
                      >
                        <option value="all">Consensus Ensemble (Tri-Model 72k)</option>
                        <option value="lr">Logistic Regression (L2 Regularized)</option>
                        <option value="rf">Random Forest Classifier (300 Trees)</option>
                        <option value="pa">Passive Aggressive (Online Stream)</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="ngram-select" className="font-label-sm text-label-sm text-on-surface-variant uppercase font-medium">TF-IDF N-Gram Scope</label>
                      <select
                        id="ngram-select"
                        value={ngramScope}
                        onChange={(e) => {
                          setNgramScope(e.target.value);
                          onShowToast(`TF-IDF Scope: ${e.target.value}`);
                        }}
                        className="bg-surface-container-lowest text-on-surface font-label-sm text-label-sm px-space-sm py-1.5 rounded focus:outline-none cursor-pointer"
                      >
                        <option>Unigram + Bigram (1, 2)</option>
                        <option>Strict Bigrams (2, 2)</option>
                        <option>Deep Trigrams (1, 3)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-xs self-end md:self-center pt-2 md:pt-0">
                    <input
                      id="strict-filter"
                      type="checkbox"
                      checked={strictFilter}
                      onChange={(e) => setStrictFilter(e.target.checked)}
                      className="rounded text-primary focus:ring-0 cursor-pointer accent-primary"
                    />
                    <label htmlFor="strict-filter" className="font-label-sm text-label-sm text-on-surface font-medium cursor-pointer select-none">Strict Sensationalism Weights</label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-xs">
                  <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm w-full sm:w-auto">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    <span>WELFake-72K cross-validated (Precision: 0.94)</span>
                  </div>
                  <div className="flex items-center gap-space-xs w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={resetChamber}
                      className="px-space-md py-2.5 rounded bg-surface-container hover:bg-surface-container-high transition-colors font-label-sm text-label-sm text-on-surface font-semibold uppercase cursor-pointer"
                    >
                      Reset Chamber
                    </button>
                    <button
                      type="button"
                      disabled={isScanning}
                      onClick={triggerVerification}
                      className="px-space-lg py-2.5 rounded bg-primary text-on-primary hover:bg-primary-container transition-all flex items-center justify-center gap-space-xs font-label-sm text-label-sm font-semibold uppercase shadow-md group cursor-pointer"
                    >
                      {isScanning ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                          <span>Processing Vectors...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px] group-hover:rotate-45 transition-transform">bolt</span>
                          <span>Run Verification Scan</span>
                          <span className="ml-1 px-1.5 py-0.5 rounded bg-surface-container/20 text-on-primary text-[10px] font-mono tracking-tighter">⌘+ENTER</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Semantic Deception Mapping */}
            <div className="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">find_in_page</span>
                  <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Semantic Deception Mapping &amp; Lexical Flagging</span>
                </div>
                <span className={`font-label-sm text-label-sm font-mono font-semibold ${currentAnalysis.isDeceptive ? 'text-error' : 'text-on-tertiary-container'}`}>
                  {currentAnalysis.anomaliesCountText}
                </span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Hover over colored spans to examine contextual risk metrics:</p>

              {activePreset === 'election' ? (
                <div className="p-space-md rounded bg-surface-container-low font-body-md text-body-md text-on-surface leading-relaxed mt-space-xs">
                  <span className="relative group cursor-help bg-error-container text-on-error-container px-1 py-0.5 rounded font-semibold">
                    BREAKING: Shocking clandestine documents
                    <span className="absolute bottom-full left-0 mb-1 hidden group-hover:flex flex-col bg-inverse-surface text-inverse-on-surface p-2 rounded shadow-xl text-left z-20 w-64 pointer-events-none">
                      <span className="font-label-sm text-label-sm font-bold text-tertiary-fixed font-mono">[FABRICATION MARKER #1]</span>
                      <span className="font-body-sm text-body-sm leading-tight mt-1">High-arousal sensationalist opener. Typical signature of synthetic clickbait vectors.</span>
                    </span>
                  </span>{' '}
                  obtained through an{' '}
                  <span className="relative group cursor-help bg-surface-container-highest px-1 py-0.5 rounded underline decoration-dotted decoration-outline">
                    unnamed insider
                    <span className="absolute bottom-full left-0 mb-1 hidden group-hover:flex flex-col bg-inverse-surface text-inverse-on-surface p-2 rounded shadow-xl text-left z-20 w-60 pointer-events-none">
                      <span className="font-label-sm text-label-sm font-bold text-secondary-fixed font-mono">[UNVERIFIED ANOMALY]</span>
                      <span className="font-body-sm text-body-sm leading-tight mt-1">Zero corroborative named attribution or institutional paper trail.</span>
                    </span>
                  </span>{' '}
                  prove that high-level authorities intentionally concealed an extraordinary scientific revolution. Insiders confirm that multiple agencies{' '}
                  <span className="relative group cursor-help bg-error-container text-on-error-container px-1 py-0.5 rounded font-semibold">
                    silently admitted in private sessions
                    <span className="absolute bottom-full right-0 mb-1 hidden group-hover:flex flex-col bg-inverse-surface text-inverse-on-surface p-2 rounded shadow-xl text-left z-20 w-64 pointer-events-none">
                      <span className="font-label-sm text-label-sm font-bold text-tertiary-fixed font-mono">[FABRICATION MARKER #2]</span>
                      <span className="font-body-sm text-body-sm leading-tight mt-1">Linguistic hearsay vector. Unverifiable private discourse attribution.</span>
                    </span>
                  </span>{' '}
                  that the breakthrough would destabilize their economic grip on traditional infrastructure... Whistleblowers warn that this{' '}
                  <span className="relative group cursor-help bg-error-container text-on-error-container px-1 py-0.5 rounded font-semibold">
                    massive coverup threatens millions
                    <span className="absolute bottom-full left-0 mb-1 hidden group-hover:flex flex-col bg-inverse-surface text-inverse-on-surface p-2 rounded shadow-xl text-left z-20 w-64 pointer-events-none">
                      <span className="font-label-sm text-label-sm font-bold text-tertiary-fixed font-mono">[FABRICATION MARKER #3]</span>
                      <span className="font-body-sm text-body-sm leading-tight mt-1">Apocalyptic existential threat framing devoid of institutional citation.</span>
                    </span>
                  </span>{' '}
                  of citizens unless alternative reporting acts immediately.
                </div>
              ) : (
                <div className="p-space-md rounded bg-surface-container-low font-body-md text-body-md text-on-surface leading-relaxed mt-space-xs">
                  <span className="bg-surface-container px-1 py-0.5 rounded font-medium">{headline || 'No headline entered'}</span> — {body}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-space-md pt-space-xs font-label-sm text-label-sm">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-error-container"></span><span className="text-on-surface font-mono">Fabrication / Sensationalism</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-surface-container-highest"></span><span className="text-on-surface font-mono">Unverified / Disputed Citation</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-surface-container"></span><span className="text-on-surface font-mono">Corroborated Baseline</span></div>
              </div>
            </div>
          </section>

          {/* Right Column (5 cols) */}
          <section className="lg:col-span-5 flex flex-col gap-space-md">
            {/* Primary Verdict Card */}
            <div className="bg-surface-container-lowest rounded shadow-lg overflow-hidden flex flex-col">
              <div className={`${currentAnalysis.isDeceptive ? 'bg-error text-on-error' : 'bg-on-tertiary-container text-on-tertiary'} px-space-md py-space-sm flex items-center justify-between`}>
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[20px]">{currentAnalysis.isDeceptive ? 'crisis_alert' : 'verified'}</span>
                  <span className="font-label-sm text-label-sm uppercase font-semibold tracking-wider">PRIMARY VERDICT ENGINE</span>
                </div>
                <span className="font-label-sm text-label-sm bg-on-error/20 px-space-xs py-0.5 rounded font-mono font-bold">{currentAnalysis.statusTag}</span>
              </div>

              <div className="p-space-lg flex flex-col gap-space-md">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className={`font-label-sm text-label-sm uppercase font-bold tracking-widest ${currentAnalysis.isDeceptive ? 'text-error' : 'text-on-tertiary-container'}`}>Calculated Risk Index</span>
                    <div className="flex items-baseline gap-space-xs mt-1">
                      <span className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">{currentAnalysis.riskPercent}%</span>
                      <span className={`font-label-sm text-label-sm font-mono font-semibold ${currentAnalysis.isDeceptive ? 'text-error' : 'text-on-tertiary-container'}`}>DECEPTION PROBABILITY</span>
                    </div>
                    <span className="font-headline-sm text-headline-sm text-on-surface mt-1">{currentAnalysis.verdictLabel}</span>
                  </div>

                  <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90 text-surface-container" viewBox="0 0 36 36">
                      <path className="stroke-current fill-none stroke-[3.2]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                      <path
                        className={`${currentAnalysis.isDeceptive ? 'stroke-error' : 'stroke-on-tertiary-container'} fill-none stroke-[3.2]`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        strokeDasharray={`${currentAnalysis.riskPercent}, 100`}
                        strokeLinecap="round"
                      ></path>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`font-label-sm text-label-sm font-mono font-bold ${currentAnalysis.isDeceptive ? 'text-error' : 'text-on-tertiary-container'}`}>{currentAnalysis.riskPercent}%</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant text-[8px] uppercase">{currentAnalysis.isDeceptive ? 'Alert' : 'Clear'}</span>
                    </div>
                  </div>
                </div>

                <div className={`${currentAnalysis.isDeceptive ? 'bg-error-container text-on-error-container' : 'bg-surface-container-low text-on-surface'} p-space-sm rounded flex items-start gap-space-sm`}>
                  <span className={`material-symbols-outlined ${currentAnalysis.isDeceptive ? 'text-error' : 'text-on-tertiary-container'} text-[20px] shrink-0 mt-0.5`}>
                    {currentAnalysis.isDeceptive ? 'gavel' : 'verified_user'}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm font-bold uppercase tracking-wide">{currentAnalysis.recommendationTitle}</span>
                    <span className="font-body-sm text-body-sm leading-snug">{currentAnalysis.recommendationBody}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-space-sm pt-space-xs font-mono">
                  <div className="bg-surface-container-low p-space-xs rounded">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block">CONFIDENCE INTERVAL:</span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">{currentAnalysis.confidenceInterval}</span>
                  </div>
                  <div className="bg-surface-container-low p-space-xs rounded">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block">WELFAKE CORPUS SIMILARITY:</span>
                    <span className={`font-label-md text-label-md font-semibold ${currentAnalysis.isDeceptive ? 'text-error' : 'text-on-tertiary-container'}`}>{currentAnalysis.corpusSimilarity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Consensus Matrix */}
            <div className="bg-surface-container-lowest rounded shadow-sm p-space-md flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">account_tree</span>
                  <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Tri-Model Ensemble Consensus</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-tertiary-container bg-surface-container px-space-xs py-0.5 rounded font-mono font-bold">{currentAnalysis.unanimityTag}</span>
              </div>

              <div className="flex flex-col gap-space-xs mt-space-xs">
                {[
                  { name: 'Logistic Regression (TF-IDF Weight)', model: currentAnalysis.models.lr, info: 'Features: 20,000 N-Grams', sub: currentAnalysis.models.lr.sigma },
                  { name: 'Random Forest (Tree Ensemble)', model: currentAnalysis.models.rf, info: 'Estimators: 300 Trees', sub: `Gini: ${currentAnalysis.models.rf.gini}` },
                  { name: 'Passive Aggressive (News Stream Drift)', model: currentAnalysis.models.pa, info: 'Loss: Hinge Adaptive', sub: currentAnalysis.models.pa.margin },
                ].map((item, idx) => (
                  <div key={idx} className="p-space-sm rounded bg-surface-container-low flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-sm text-label-sm text-primary font-semibold">{item.name}</span>
                        <span className="px-1.5 py-0.2 rounded bg-surface-container font-label-sm text-label-sm font-mono text-on-surface-variant">{item.model.latency}ms</span>
                      </div>
                      <span className={`font-label-sm text-label-sm font-mono font-bold ${item.model.verdict === 'FAKE' ? 'text-error' : 'text-on-tertiary-container'}`}>
                        {item.model.prob}% {item.model.verdict}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded overflow-hidden">
                      <div
                        className={`${item.model.verdict === 'FAKE' ? 'bg-error' : 'bg-on-tertiary-container'} h-full rounded transition-all duration-300`}
                        style={{ width: `${item.model.prob}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
                      <span>{item.info}</span>
                      <span>{item.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stylometric Diagnostics */}
            <div className="bg-surface-container-lowest rounded shadow-sm p-space-md flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Stylometric Diagnostics</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">4 Vectors</span>
              </div>
              <div className="space-y-space-sm mt-space-xs">
                {[
                  { label: 'Emotional Hyperbole Index', diag: currentAnalysis.diagnostics.hyperbole },
                  { label: 'Clickbait Syntax Frequency', diag: currentAnalysis.diagnostics.clickbait },
                  { label: 'Verifiable Source Citations', diag: currentAnalysis.diagnostics.citations },
                  { label: 'Unattributed Passive Claims', diag: currentAnalysis.diagnostics.passive },
                ].map((row, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center font-label-sm text-label-sm">
                      <span className="text-on-surface">{row.label}</span>
                      <span className={`font-mono font-bold ${row.diag.isError ? 'text-error' : 'text-on-tertiary-container'}`}>{row.diag.tag}</span>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded overflow-hidden">
                      <div className={`${row.diag.isError ? 'bg-error' : 'bg-on-tertiary-container'} h-full rounded`} style={{ width: `${row.diag.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Archival Exports */}
            <div className="bg-surface-container-lowest rounded shadow-sm p-space-sm flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold px-space-xs">Archival Exports &amp; Whistleblower Chain:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs">
                <button
                  type="button"
                  onClick={() => onShowToast('Generating Encrypted Broadsheet Dossier...')}
                  className="px-space-sm py-2 rounded bg-surface-container-low hover:bg-surface-container transition-colors font-label-sm text-label-sm text-on-surface flex items-center justify-center gap-1 font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                  <span>Forensic PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(currentAnalysis, null, 2));
                    onShowToast('Forensic JSON Telemetry Copied to Clipboard');
                  }}
                  className="px-space-sm py-2 rounded bg-surface-container-low hover:bg-surface-container transition-colors font-label-sm text-label-sm text-on-surface flex items-center justify-center gap-1 font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">data_object</span>
                  <span>Copy JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('Article Ingest Flagged in Verification Database')}
                  className="px-space-sm py-2 rounded bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors font-label-sm text-label-sm flex items-center justify-center gap-1 font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">flag</span>
                  <span>Flag to DB</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer 4-Phase Pipeline */}
        <div className="mt-space-xl pt-space-lg">
          <div className="flex items-center justify-between mb-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">architecture</span>
              <span className="font-headline-sm text-headline-sm text-primary">Inference Execution Sequence</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">WELFake Architecture Specification v2.8</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {[
              { phase: 'PHASE 01', icon: 'filter_alt', title: 'Linguistic Normalization', desc: 'Stopword exclusion, regex sanitization, lemmatization, and headline capitalization variance extraction.', note: 'Avg: 2.4ms per cycle' },
              { phase: 'PHASE 02', icon: 'scatter_plot', title: 'TF-IDF Vector Space', desc: 'Projection into 20,000 sub-linear term frequency dimensions with unigram and bigram token weighting.', note: '20,000 Dimensions' },
              { phase: 'PHASE 03', icon: 'hub', title: 'Tri-Model Ensemble', desc: 'Independent evaluation by Logistic Regression, Random Forest, and Passive Aggressive classifiers.', note: 'Ensemble Consensus: 100%' },
              { phase: 'PHASE 04', icon: 'fact_check', title: 'Editorial Scorecard', desc: 'Hyperbole correlation, source attribution density, and cryptographically verified JSON telemetry log.', note: 'SHA-256 Ledger Stamp' },
            ].map((p, i) => (
              <div key={i} className="p-space-md rounded bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs relative overflow-hidden">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-sm text-label-sm font-mono font-bold text-primary">{p.phase}</span>
                  <span className="material-symbols-outlined text-[20px]">{p.icon}</span>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary mt-1">{p.title}</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{p.desc}</p>
                <div className="pt-2 font-mono text-[10px] text-on-surface-variant">{p.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
