import predictors from './lexicalPredictors.json'

type Direction = 'fake' | 'real' | null

interface Term {
  word: string
  direction: Direction
  weight: number
}

// Flatten the real, extracted Logistic Regression coefficients into a lookup.
// (LR is used for highlighting since it's the only model whose coefficients
// map cleanly to "pushes toward X" — Random Forest importances are unsigned.)
const LOOKUP: Record<string, { direction: Direction; weight: number }> = {}
for (const t of predictors.logistic_regression.fake) {
  LOOKUP[t.term] = { direction: 'fake', weight: t.weight }
}
for (const t of predictors.logistic_regression.real) {
  LOOKUP[t.term] = { direction: 'real', weight: t.weight }
}

/** Splits text into tokens, tagging any word that's a known real/fake signal. */
export function highlightTerms(text: string): Term[] {
  const words = text.split(/(\s+)/) // keep whitespace as separate tokens
  return words.map((w) => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '')
    const match = LOOKUP[clean]
    return {
      word: w,
      direction: match?.direction ?? null,
      weight: match?.weight ?? 0,
    }
  })
}
