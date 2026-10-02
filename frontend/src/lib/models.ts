import type { ModelName } from './api'

export const MODEL_ORDER: ModelName[] = ['logistic_regression', 'random_forest', 'passive_aggressive']

export const MODEL_LABELS: Record<string, string> = {
  logistic_regression: 'Logistic Regression',
  random_forest: 'Random Forest',
  passive_aggressive: 'Passive Aggressive',
}

export const modelLabel = (id: string) => MODEL_LABELS[id] || id

export function confidenceTier(pct: number) {
  if (pct >= 90) return 'High confidence'
  if (pct >= 70) return 'Moderate confidence'
  return 'Low confidence — treat as uncertain'
}

export function explain(label: 'REAL' | 'FAKE', pct: number | null) {
  const base =
    label === 'REAL'
      ? 'The writing style and vocabulary resemble articles from established outlets in the training data.'
      : 'The writing style and vocabulary resemble fabricated or misleading articles in the training data.'
  if (pct === null) return `${base} This model does not output a probability score.`
  return `${base} ${confidenceTier(pct)}.`
}
