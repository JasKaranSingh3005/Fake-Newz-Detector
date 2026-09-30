const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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
    this.status = status
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(`${API_URL}/`, { signal: controller.signal })
    clearTimeout(timeout)
    return res.ok
  } catch {
    return false
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
    throw new ApiError('Please enter some text to analyze.')
  }
  if (text.length > 20000) {
    throw new ApiError('That text is too long — please keep it under 20,000 characters.')
  }

  let res: Response
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)
    res = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('The request took too long. Please try again.')
    }
    throw new ApiError('Could not reach the ML backend. It may be offline.')
  }

  if (res.status === 400) {
    const body = await safeJson(res)
    throw new ApiError(body?.detail || 'Invalid request. Please check your input.', 400)
  }
  if (res.status === 404) {
    throw new ApiError('That model is not available on the server.', 404)
  }
  if (res.status >= 500) {
    throw new ApiError('The ML backend encountered an error. Please try again shortly.', res.status)
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
