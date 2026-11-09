import { cn } from '@/lib/utils'

/*
 * kip mark, drawn on a 64×64 grid.
 * Stem = this phone. Chevron = the other phone, leaning in.
 * The 5-unit gap between them is the moment right before the tap.
 */
export const KIP_STEM = { x: 14, y: 12, width: 9, height: 40, rx: 4.5 }
export const KIP_CHEVRON = 'M45.5 16 L32.5 32 L45.5 48'

export function KipGlyph({ className, animated = false }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={cn('size-6', className)}>
      <rect {...KIP_STEM} fill="currentColor" />
      <path
        d={KIP_CHEVRON}
        stroke="currentColor"
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(animated && 'kip-knock')}
      />
    </svg>
  )
}

type MarkTone = 'gold' | 'vault' | 'outline'

const toneClass: Record<MarkTone, string> = {
  gold: 'bg-primary text-primary-foreground',
  vault: 'bg-background text-primary ring-1 ring-inset ring-border',
  outline: 'bg-card text-primary ring-1 ring-inset ring-primary/40',
}

export function KipMark({
  size = 40,
  tone = 'gold',
  animated = false,
  className,
}: {
  size?: number
  tone?: MarkTone
  animated?: boolean
  className?: string
}) {
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center', toneClass[tone], className)}
      style={{ width: size, height: size, borderRadius: size * 0.25 }}
    >
      <KipGlyph animated={animated} className="size-full" />
    </span>
  )
}

export function KipWordmark({
  size = 40,
  tone = 'gold',
  className,
}: {
  size?: number
  tone?: MarkTone
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center', className)} style={{ gap: size * 0.28 }}>
      <KipMark size={size} tone={tone} />
      <span className="font-bold leading-none tracking-tight" style={{ fontSize: size * 0.82 }}>
        kip
      </span>
    </span>
  )
}
