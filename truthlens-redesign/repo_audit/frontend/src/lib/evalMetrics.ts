// Real evaluation results, produced by running src/evaluate.py locally
// against the actual trained models and a held-out 20% test split
// (12,625 articles). Not estimates — exact output, transcribed as-is.

export interface ClassMetrics {
  precision: number
  recall: number
  f1: number
  support: number
}

export interface ModelMetrics {
  name: string
  accuracy: number
  f1: number
  rocAuc: number
  real: ClassMetrics
  fake: ClassMetrics
}

export const EVAL_METRICS: ModelMetrics[] = [
  {
    name: 'Logistic Regression',
    accuracy: 0.9701,
    f1: 0.9701,
    rocAuc: 0.9955,
    real: { precision: 0.98, recall: 0.97, f1: 0.97, support: 6959 },
    fake: { precision: 0.96, recall: 0.97, f1: 0.97, support: 5666 },
  },
  {
    name: 'Random Forest',
    accuracy: 0.9458,
    f1: 0.9458,
    rocAuc: 0.9898,
    real: { precision: 0.94, recall: 0.96, f1: 0.95, support: 6959 },
    fake: { precision: 0.95, recall: 0.93, f1: 0.94, support: 5666 },
  },
  {
    name: 'Passive Aggressive',
    accuracy: 0.9723,
    f1: 0.9723,
    rocAuc: 0.9957,
    real: { precision: 0.98, recall: 0.97, f1: 0.97, support: 6959 },
    fake: { precision: 0.97, recall: 0.97, f1: 0.97, support: 5666 },
  },
]

// Full cleaned corpus composition (test-set support scales up consistently
// with these totals at the 80/20 split used in preprocess.py).
export const CORPUS = {
  real: 34791,
  fake: 28330,
  total: 34791 + 28330,
}
