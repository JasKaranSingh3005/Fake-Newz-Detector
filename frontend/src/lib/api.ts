const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Render's free tier can take 30-50s to wake from a cold start, so every
// request that might be the first one needs real headroom.
const WAKE_TIMEOUT_MS = 60000
const MAX_CHARS = 20000

export type ModelName = 'logistic_regression' | 'random_forest' | 'passive_aggressive'

export interface PredictResponse {
  label: 'REAL' | 'FAKE'
  confidence: number | null
  model_used: string
}

export class ApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function checkHealth(): Promise<boolean> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), WAKE_TIMEOUT_MS)
  try {
    const res = await fetch(`${API_URL}/`, { signal: controller.signal })
    return res.ok
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

export async function fetchModels(): Promise<string[]> {
  const res = await fetch(`${API_URL}/models`)
  if (!res.ok) throw new ApiError('Could not load available models', res.status)
  const data = await res.json()
  return data.available_models
}

export async function predict(text: string, model: ModelName): Promise<PredictResponse> {
  if (!text.trim()) {
    throw new ApiError('Paste a headline or article to analyze.')
  }
  if (text.length > MAX_CHARS) {
    throw new ApiError(`That text is too long. Keep it under ${MAX_CHARS.toLocaleString()} characters.`)
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), WAKE_TIMEOUT_MS)
  let res: Response
  try {
    res = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model }),
      signal: controller.signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('The server took too long to respond. Try again in a moment.')
    }
    throw new ApiError('Could not reach the analysis server. It may be offline.')
  } finally {
    clearTimeout(timeout)
  }

  if (res.status === 400 || res.status === 422) {
    const body = await safeJson(res)
    const detail = typeof body?.detail === 'string' ? body.detail : null
    throw new ApiError(detail || 'Invalid request. Check your text and try again.', res.status)
  }
  if (res.status === 404) {
    throw new ApiError('That model is not available on the server.', 404)
  }
  if (res.status >= 500) {
    throw new ApiError('The analysis server hit an error. Try again shortly.', res.status)
  }
  if (!res.ok) {
    throw new ApiError('Something went wrong analyzing this text.', res.status)
  }

  const data = await safeJson(res)
  if (!data || typeof data.label !== 'string') {
    throw new ApiError('Received an unexpected response from the server.')
  }
  return data as PredictResponse
}

async function safeJson(res: Response): Promise<any | null> {
  try {
    return await res.json()
  } catch {
    return null
  }
}

export interface EnsembleResult extends PredictResponse {
  latencyMs: number
  error?: string
}

/** Calls all three models in parallel and returns individually measured results. */
export async function predictEnsemble(text: string): Promise<EnsembleResult[]> {
  const models: ModelName[] = ['logistic_regression', 'random_forest', 'passive_aggressive']
  return Promise.all(
    models.map(async (model) => {
      const start = performance.now()
      try {
        const res = await predict(text, model)
        return { ...res, latencyMs: Math.round(performance.now() - start) }
      } catch (err) {
        return {
          label: 'REAL' as const,
          confidence: null,
          model_used: model,
          latencyMs: Math.round(performance.now() - start),
          error: err instanceof ApiError ? err.message : 'Request failed',
        }
      }
    })
  )
}
