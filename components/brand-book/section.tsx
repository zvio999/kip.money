import { cn } from '@/lib/utils'

export function BookSection({
  id,
  label,
  title,
  intro,
  children,
}: {
  id: string
  label: string
  title: string
  intro?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex scroll-mt-10 flex-col gap-8 border-t border-border py-16">
      <header className="flex max-w-2xl flex-col gap-3">
        <span className="font-mono text-xs tracking-[0.16em] text-primary uppercase">{label}</span>
        <h2 id={`${id}-title`} className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
          {title}
        </h2>
        {intro && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{intro}</p>}
      </header>
      {children}
    </section>
  )
}

export function Panel({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('rounded-3xl bg-card p-6 ring-1 ring-inset ring-border', className)} {...props} />
}

export function PanelCaption({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{children}</p>
    </div>
  )
}

export function Rule({ kind, children }: { kind: 'do' | 'dont'; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-full px-2.5 py-1 font-mono text-xs font-semibold tracking-wide uppercase',
        kind === 'do' ? 'bg-success/12 text-success' : 'bg-destructive/12 text-destructive',
      )}
    >
      {children}
    </span>
  )
}
