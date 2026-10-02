import type { ReactNode } from 'react'

interface Props {
  eyebrow: string
  title: string
  description?: ReactNode
  center?: boolean
}

export default function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div className="grid gap-4 border-t-2 border-ink pt-5 md:grid-cols-12 md:gap-6">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary md:col-span-3">{eyebrow}</p>
      <div className="md:col-span-9">
        <h2 className="text-balance text-4xl font-bold leading-[1.02] tracking-tight text-ink sm:text-5xl">{title}</h2>
        {description && <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-ink-soft">{description}</p>}
      </div>
    </div>
  )
}
