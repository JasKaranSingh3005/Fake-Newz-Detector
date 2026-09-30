import { useEffect, useState } from 'react'
import { Circle } from 'lucide-react'
import { checkHealth } from '../lib/api'

export default function HealthBadge() {
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    const check = async () => {
      const result = await checkHealth()
      if (mounted) setOnline(result)
    }
    check()
    // Reasonable polling interval — not hammering the endpoint
    const interval = setInterval(check, 60000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  const label = online === null ? 'Checking…' : online ? 'API Connected' : 'API Offline'
  const color = online === null ? 'text-slate-400' : online ? 'text-real' : 'text-fake'

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${color}`} role="status" aria-live="polite">
      <Circle className="w-2 h-2 fill-current" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
