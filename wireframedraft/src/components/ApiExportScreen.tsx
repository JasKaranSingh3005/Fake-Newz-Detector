import React, { useState } from 'react';

interface ApiExportScreenProps {
  onShowToast: (msg: string) => void;
}

export const ApiExportScreen: React.FC<ApiExportScreenProps> = ({ onShowToast }) => {
  const [selectedLang, setSelectedLang] = useState<'curl' | 'python' | 'typescript'>('curl');
  const [liveResponse, setLiveResponse] = useState<string>(
    JSON.stringify(
      {
        status: 'ok',
        session_id: 'TL-9942-WELFAKE',
        checkpoint: 'v2.8.4-RELEASE',
        latency_ms: 17.4,
        verdict: {
          deception_probability: 0.894,
          classification: 'HIGHLY_UNRELIABLE',
          consensus_unanimity: '3/3',
        },
        models: {
          logistic_regression_l2: 0.912,
          random_forest_100t: 0.868,
          passive_aggressive: 0.903,
        },
        ledger_sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      },
      null,
      2
    )
  );

  const codeSnippets: Record<'curl' | 'python' | 'typescript', string> = {
    curl: `curl -X POST "https://api.truthlens.editorial/v2/analyze/stream" \\
  -H "Authorization: Bearer tl_live_9942_welfake_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "headline": "BREAKING: Secret Classified Briefing Reveals Fabricated Tech Breakthrough",
    "ensemble": "all",
    "ngram_range": [1, 2],
    "strict_sensationalism_weights": true
  }'`,
    python: `import requests

resp = requests.post(
    "https://api.truthlens.editorial/v2/analyze/stream",
    headers={"Authorization": "Bearer tl_live_9942_welfake_key"},
    json={
        "headline": "BREAKING: Secret Classified Briefing Reveals Fabricated Tech Breakthrough",
        "ensemble": "all",
        "ngram_range": [1, 2],
        "strict_sensationalism_weights": True,
    },
    timeout=5.0,
)
print(resp.json()["verdict"])`,
    typescript: `const response = await fetch("https://api.truthlens.editorial/v2/analyze/stream", {
  method: "POST",
  headers: {
    "Authorization": "Bearer tl_live_9942_welfake_key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    headline: "BREAKING: Secret Classified Briefing Reveals Fabricated Tech Breakthrough",
    ensemble: "all",
    ngram_range: [1, 2],
    strict_sensationalism_weights: true,
  }),
});
const telemetry = await response.json();`,
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(codeSnippets[selectedLang]).then(() => {
      onShowToast(`Copied ${selectedLang.toUpperCase()} integration snippet to clipboard`);
    });
  };

  const triggerTestWebhook = () => {
    const updated = {
      status: 'ok',
      session_id: `TL-${Math.floor(1000 + Math.random() * 9000)}-WELFAKE`,
      timestamp: new Date().toISOString(),
      checkpoint: 'v2.8.4-RELEASE',
      latency_ms: Number((14 + Math.random() * 5).toFixed(1)),
      verdict: {
        deception_probability: 0.894,
        classification: 'HIGHLY_UNRELIABLE',
        consensus_unanimity: '3/3',
      },
      models: {
        logistic_regression_l2: 0.912,
        random_forest_100t: 0.868,
        passive_aggressive: 0.903,
      },
    };
    setLiveResponse(JSON.stringify(updated, null, 2));
    onShowToast('Dispatched Live FastAPI Stream Request (200 OK)');
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full px-gutter py-space-xl flex flex-col gap-space-xl max-w-7xl mx-auto">
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="px-space-sm py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              FastAPI Telemetry Gateway // v2.8.4-RELEASE
            </span>
            <span className="text-outline-variant font-label-sm text-label-sm">•</span>
            <span className="font-label-sm text-label-sm text-on-tertiary-container flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse inline-block"></span>
              REST &amp; STREAMING ENDPOINTS ACTIVE
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
            <div className="max-w-4xl">
              <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">
                Newsroom API Integration &amp; Cryptographic Telemetry Export
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs">
                Integrate low-latency scikit-learn ensemble scoring directly into CMS publishing workflows, wire ingestion queues, and investigative archival databases.
              </p>
            </div>
            <button
              type="button"
              onClick={triggerTestWebhook}
              className="flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary hover:bg-primary-container transition-colors rounded font-label-sm text-label-sm uppercase tracking-wider shadow-md self-start lg:self-end shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">bolt</span>
              TEST ENDPOINT PING
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Primary Ingestion Endpoint</span>
                <h2 className="font-headline-md text-headline-md text-primary mt-0.5">POST /api/v2/analyze/stream</h2>
              </div>
              <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded">
                {(['curl', 'python', 'typescript'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLang(lang)}
                    className={`px-space-sm py-1 rounded font-label-sm text-label-sm uppercase cursor-pointer ${
                      selectedLang === lang ? 'bg-primary text-on-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <pre className="bg-inverse-surface text-inverse-on-surface p-space-md rounded font-mono text-xs overflow-x-auto leading-relaxed">
              {codeSnippets[selectedLang]}
            </pre>

            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                Rate Limit: 2,500 req/min • P99 Latency: 31.2ms
              </span>
              <button
                type="button"
                onClick={handleCopySnippet}
                className="px-space-md py-2 rounded bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface font-semibold uppercase flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                Copy Request Snippet
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Serialized JSON Telemetry Payload</span>
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-mono font-label-sm text-label-sm font-bold">200 OK</span>
              </div>
              <pre className="bg-surface-container-low p-space-md rounded font-mono text-xs text-on-surface overflow-x-auto leading-relaxed">
                {liveResponse}
              </pre>
            </div>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(liveResponse);
                onShowToast('JSON Response Copied to Clipboard');
              }}
              className="w-full py-2.5 rounded bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-sm text-label-sm uppercase font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">data_object</span>
              Copy Response Schema
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
