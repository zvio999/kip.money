'use client'

import { useEffect, useId, useRef } from 'react'

export function BottomSheet({
  title,
  onClose,
  children,
}: {
  title: React.ReactNode
  onClose: () => void
  children: React.ReactNode
}) {
  const titleId = useId()
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close sheet"
        onClick={onClose}
        className="absolute inset-0 bg-background/75 duration-200 animate-in fade-in"
      />
      <section
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92%] flex-col rounded-t-[1.75rem] bg-card ring-1 ring-border outline-none duration-300 ease-out animate-in slide-in-from-bottom"
      >
        <div className="flex justify-center pt-2.5" aria-hidden="true">
          <span className="h-1 w-10 rounded-full bg-muted" />
        </div>
        <header className="flex items-center justify-between gap-4 px-5 pt-3 pb-4">
          <h2 id={titleId} className="flex min-w-0 items-center gap-3 text-xl font-semibold tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="h-9 shrink-0 rounded-full bg-muted px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Close
          </button>
        </header>
        <div className="flex flex-col gap-5 overflow-y-auto px-5 pb-safe">{children}</div>
      </section>
    </div>
  )
}
