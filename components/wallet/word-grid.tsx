'use client'

import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export function WordInputGrid({ words, onChange }: { words: string[]; onChange: (words: string[]) => void }) {
  const update = (index: number, value: string) => {
    const parts = value.trim().toLowerCase().split(/\s+/)
    if (parts.length > 1) {
      const next = [...words]
      parts.forEach((word, offset) => {
        if (index + offset < next.length) next[index + offset] = word
      })
      onChange(next)
      return
    }
    const next = [...words]
    next[index] = value.toLowerCase().replace(/\s/g, '')
    onChange(next)
  }

  return (
    <ol className="grid grid-cols-2 gap-2.5">
      {words.map((word, i) => (
        <li key={i}>
          <label
            className={cn(
              'flex h-12 items-center gap-2 rounded-xl bg-card px-3 ring-1 ring-inset focus-within:ring-2 focus-within:ring-primary',
              word ? 'ring-primary/40' : 'ring-border',
            )}
          >
            <span className="w-5 font-mono text-xs text-muted-foreground tabular-nums">{i + 1}</span>
            <span className="sr-only">Word {i + 1}</span>
            <input
              value={word}
              onChange={(e) => update(i, e.target.value)}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent font-mono text-[15px] text-foreground outline-none"
            />
          </label>
        </li>
      ))}
    </ol>
  )
}

export function WordDisplayGrid({ words }: { words: string[] }) {
  return (
    <ol className="grid grid-cols-2 gap-2.5">
      {words.map((word, i) => (
        <li key={i} className="flex h-12 items-center gap-2 rounded-xl bg-card px-3 ring-1 ring-inset ring-border">
          <span className="w-5 font-mono text-xs text-muted-foreground tabular-nums">{i + 1}</span>
          <span className="font-mono text-[15px]">{word}</span>
        </li>
      ))}
    </ol>
  )
}

export function FlowHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="flex items-center gap-3 pt-safe pb-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="flex size-10 items-center justify-center rounded-xl bg-card ring-1 ring-inset ring-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <ArrowLeft className="size-5" aria-hidden="true" />
      </button>
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  )
}
