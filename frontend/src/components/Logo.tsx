export function LogoMark({ className = 'h-[18px] w-[18px]' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 5h12M3 9h5M3 13h4M3 17h6" opacity={0.55} />
      <circle cx="14.5" cy="12.5" r="4.75" />
      <path d="M12.5 12.5h4" />
      <path d="m18 16 3 3" strokeWidth={2.5} />
    </svg>
  )
}

export default function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-fg">
        <LogoMark />
      </span>
      <span className="text-[17px] font-semibold tracking-tight text-ink">
        Truth<span className="text-primary">Lens</span>
      </span>
    </span>
  )
}
