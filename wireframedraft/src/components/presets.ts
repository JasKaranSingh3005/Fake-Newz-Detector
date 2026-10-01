export interface PresetData {
  headline: string;
  body: string;
  isDeceptive: boolean;
  riskPercent: number;
  verdictLabel: string;
  statusTag: string;
  recommendationTitle: string;
  recommendationBody: string;
  confidenceInterval: string;
  corpusSimilarity: string;
  unanimityTag: string;
  models: {
    lr: { prob: number; latency: number; sigma: string; verdict: 'FAKE' | 'TRUE' };
    rf: { prob: number; latency: number; gini: string; verdict: 'FAKE' | 'TRUE' };
    pa: { prob: number; latency: number; margin: string; verdict: 'FAKE' | 'TRUE' };
  };
  diagnostics: {
    hyperbole: { val: number; tag: string; isError: boolean };
    clickbait: { val: number; tag: string; isError: boolean };
    citations: { val: number; tag: string; isError: boolean };
    passive: { val: number; tag: string; isError: boolean };
  };
  anomaliesCountText: string;
}

export const PRESET_SAMPLES: Record<'election' | 'routine' | 'health' | 'financial', PresetData> = {
  election: {
    headline: 'BREAKING: Secret Classified Briefing Reveals Fabricated Tech Breakthrough Suppressed by Officials',
    body: `BREAKING: Shocking clandestine documents obtained through an unnamed insider prove that high-level authorities intentionally concealed an extraordinary scientific revolution. Insiders confirm that multiple agencies silently admitted in private sessions that the breakthrough would destabilize their economic grip on traditional infrastructure.\n\nReliable sources close to the inner circle now claim the evidence is conclusive, though regulatory bodies refuse to issue formal denials or confirm the timeline. Mainstream networks have enforced total radio silence surrounding the astonishing leaked memos.\n\nCritics and whistleblowers warn that this massive coverup threatens millions of citizens unless alternative independent reporting forces transparent declassification before midnight.`,
    isDeceptive: true,
    riskPercent: 89.4,
    verdictLabel: 'HIGHLY UNRELIABLE / SENSATIONALIST',
    statusTag: 'STATUS: CRITICAL',
    recommendationTitle: 'RECOMMENDATION: HOLD PUBLICATION & FLAG',
    recommendationBody: 'Severe syntactic manipulation markers and lack of corroborative citations exceed threshold (85.0%). Requires human editorial oversight.',
    confidenceInterval: '94.2% (±1.8%)',
    corpusSimilarity: '97.1% Match',
    unanimityTag: '3/3 FULL UNANIMITY',
    models: {
      lr: { prob: 91.2, latency: 14, sigma: '+2.84 Sigma', verdict: 'FAKE' },
      rf: { prob: 86.8, latency: 28, gini: '0.12', verdict: 'FAKE' },
      pa: { prob: 90.3, latency: 11, margin: 'Convex Boundary Active', verdict: 'FAKE' },
    },
    diagnostics: {
      hyperbole: { val: 88, tag: '88% (CRITICAL)', isError: true },
      clickbait: { val: 76, tag: '76% (HIGH)', isError: true },
      citations: { val: 12, tag: '12% (LACKING)', isError: true },
      passive: { val: 64, tag: '64% (ELEVATED)', isError: false },
    },
    anomaliesCountText: '4 CRITICAL ANOMALIES IDENTIFIED',
  },
  routine: {
    headline: 'Treasury Department Announces Quarterly Refunding Schedule and Bond Issuance Targets',
    body: `The U.S. Department of the Treasury today announced its current estimates of net marketable borrowing for the January through March 2024 quarter. According to official public statements released via the Office of Debt Management, institutional yields remain closely aligned with Federal Reserve benchmark guidance.\n\nSenior Treasury officials confirmed during Tuesday's scheduled press briefing that auction sizes for 10-year and 30-year notes will adhere to the published statutory calendar. Independent primary dealers cited in the quarterly regulatory filing noted stable liquidity across secondary bond markets.`,
    isDeceptive: false,
    riskPercent: 6.4,
    verdictLabel: 'CORROBORATED WIRE DISPATCH / VERIFIED',
    statusTag: 'STATUS: VERIFIED',
    recommendationTitle: 'RECOMMENDATION: CLEAR FOR EDITORIAL PUBLICATION',
    recommendationBody: 'Institutional attribution signatures and low emotional hyperbole align with verified wire benchmarks (deception risk < 10.0%).',
    confidenceInterval: '96.8% (±1.1%)',
    corpusSimilarity: '98.4% Match',
    unanimityTag: '3/3 FULL UNANIMITY',
    models: {
      lr: { prob: 93.8, latency: 12, sigma: '-3.12 Sigma', verdict: 'TRUE' },
      rf: { prob: 94.5, latency: 25, gini: '0.07', verdict: 'TRUE' },
      pa: { prob: 92.4, latency: 10, margin: 'Verified Wire Plane', verdict: 'TRUE' },
    },
    diagnostics: {
      hyperbole: { val: 8, tag: '8% (NOMINAL)', isError: false },
      clickbait: { val: 5, tag: '5% (MINIMAL)', isError: false },
      citations: { val: 92, tag: '92% (ROBUST)', isError: false },
      passive: { val: 18, tag: '18% (LOW)', isError: false },
    },
    anomaliesCountText: '0 CRITICAL ANOMALIES • 3 CORROBORATED CITATIONS',
  },
  health: {
    headline: 'Renowned Biologist Uncovers Miracle Household Tonic That Eliminates Cellular Aging Overnight',
    body: `A rogue medical researcher who was banned from academic symposiums has finally released the formula Big Pharma tried to suppress for thirty years. According to unverified private trials, drinking this proprietary salt mixture will completely eradicate biological deterioration in mere days without clinical prescription.`,
    isDeceptive: true,
    riskPercent: 94.8,
    verdictLabel: 'FABRICATED / PSEUDOSCIENTIFIC CLAIM',
    statusTag: 'STATUS: CRITICAL',
    recommendationTitle: 'RECOMMENDATION: QUARANTINE & REJECT',
    recommendationBody: 'Extreme miracle-cure lexical markers and conspiratorial suppression tropes detected.',
    confidenceInterval: '97.4% (±0.9%)',
    corpusSimilarity: '98.9% Match',
    unanimityTag: '3/3 FULL UNANIMITY',
    models: {
      lr: { prob: 96.1, latency: 13, sigma: '+3.45 Sigma', verdict: 'FAKE' },
      rf: { prob: 93.4, latency: 27, gini: '0.09', verdict: 'FAKE' },
      pa: { prob: 95.0, latency: 11, margin: 'Extreme Deception Plane', verdict: 'FAKE' },
    },
    diagnostics: {
      hyperbole: { val: 95, tag: '95% (EXTREME)', isError: true },
      clickbait: { val: 89, tag: '89% (CRITICAL)', isError: true },
      citations: { val: 4, tag: '4% (ABSENT)', isError: true },
      passive: { val: 78, tag: '78% (HIGH)', isError: true },
    },
    anomaliesCountText: '5 CRITICAL ANOMALIES IDENTIFIED',
  },
  financial: {
    headline: 'Federal Reserve Holds Benchmark Overnight Rate at 5.25% - 5.50% Following FOMC Meeting',
    body: `The Federal Open Market Committee decided unanimously at its scheduled statutory meeting today to maintain the target range for the federal funds rate at 5.25% to 5.50%. Committee members noted that job gains have moderated while inflation has eased over the past twelve months, though remaining above the statutory two percent target.`,
    isDeceptive: false,
    riskPercent: 4.8,
    verdictLabel: 'CORROBORATED INSTITUTIONAL RECORD',
    statusTag: 'STATUS: VERIFIED',
    recommendationTitle: 'RECOMMENDATION: CLEAR FOR EDITORIAL PUBLICATION',
    recommendationBody: 'Unanimous FOMC statutory terminology and restrained empirical framing verified against baseline.',
    confidenceInterval: '97.9% (±0.8%)',
    corpusSimilarity: '99.1% Match',
    unanimityTag: '3/3 FULL UNANIMITY',
    models: {
      lr: { prob: 95.4, latency: 11, sigma: '-3.40 Sigma', verdict: 'TRUE' },
      rf: { prob: 96.2, latency: 26, gini: '0.05', verdict: 'TRUE' },
      pa: { prob: 94.0, latency: 10, margin: 'Verified Wire Plane', verdict: 'TRUE' },
    },
    diagnostics: {
      hyperbole: { val: 6, tag: '6% (NOMINAL)', isError: false },
      clickbait: { val: 4, tag: '4% (MINIMAL)', isError: false },
      citations: { val: 96, tag: '96% (VERIFIED)', isError: false },
      passive: { val: 14, tag: '14% (LOW)', isError: false },
    },
    anomaliesCountText: '0 CRITICAL ANOMALIES • 4 INSTITUTIONAL MARKERS',
  },
};
