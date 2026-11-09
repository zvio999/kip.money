'use client'

import { useEffect, useState } from 'react'
import { Check, Nfc } from 'lucide-react'
import { KipGlyph } from './kip-logo'
import { cn } from '@/lib/utils'

export type TapPhase = 'apart' | 'approach' | 'contact' | 'transfer' | 'done'

const PHASE_DURATIONS: Record<TapPhase, number> = {
  apart: 900,
  approach: 1100,
  contact: 900,
  transfer: 1400,
  done: 1800,
}

const PHASE_ORDER: TapPhase[] = ['apart', 'approach', 'contact', 'transfer', 'done']

export function useTapLoop() {
  const [phase, setPhase] = useState<TapPhase>('apart')
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase(PHASE_ORDER[(PHASE_ORDER.indexOf(phase) + 1) % PHASE_ORDER.length])
    }, PHASE_DURATIONS[phase])
    return () => clearTimeout(timer)
  }, [phase])
  return phase
}

const phonePose: Record<TapPhase, { x: number; rotate: number }> = {
  apart: { x: 104, rotate: 0 },
  approach: { x: 74, rotate: 12 },
  contact: { x: 52, rotate: 16 },
  transfer: { x: 52, rotate: 16 },
  done: { x: 96, rotate: 4 },
}

export function TapAnimation({
  phase,
  perspective = 'pay',
  caption = 'Pay',
}: {
  phase: TapPhase
  perspective?: 'pay' | 'get'
  caption?: string
}) {
  const { x, rotate } = phonePose[phase]
  const touching = phase === 'contact' || phase === 'transfer'
  const labels = perspective === 'pay' ? ['You', 'Receiver'] : ['Sender', 'You']

  return (
    <div
      className="relative h-60 w-full shrink-0"
      role="img"
      aria-label="Animation: hold the top of the sender’s phone against the top of the receiver’s phone until the payment is confirmed."
    >
      {/* Sender phone */}
      <div
        className="absolute top-1/2 left-1/2 transition-transform duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
        style={{ transform: `translate(-50%, -50%) translateX(${-x}px) rotate(${rotate}deg)` }}
      >
        <div className="flex h-44 w-24 flex-col rounded-[1.4rem] bg-muted p-1.5 shadow-lg ring-1 ring-border">
          <div className="flex flex-1 flex-col items-center justify-between rounded-[1.1rem] bg-primary py-4 text-primary-foreground">
            <KipGlyph className="size-5" />
            <Nfc className={cn('size-6', phase !== 'done' && 'kip-breathe')} aria-hidden="true" />
            <span className="font-mono text-[9px] font-semibold">{caption}</span>
          </div>
        </div>
        <span
          className={cn(
            'mt-3 block text-center text-xs',
            perspective === 'pay' ? 'font-semibold text-foreground' : 'text-muted-foreground',
          )}
        >
          {labels[0]}
        </span>
      </div>

      {/* Receiver phone */}
      <div
        className="absolute top-1/2 left-1/2 transition-transform duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
        style={{ transform: `translate(-50%, -50%) translateX(${x}px) rotate(${-rotate}deg)` }}
      >
        <div className="flex h-44 w-24 flex-col rounded-[1.4rem] bg-muted p-1.5 shadow-lg ring-1 ring-border">
          <div
            className={cn(
              'flex flex-1 items-center justify-center rounded-[1.1rem] transition-colors duration-500',
              phase === 'done' ? 'bg-success text-primary-foreground' : 'bg-background text-muted-foreground',
            )}
          >
            {phase === 'done' ? (
              <Check className="size-8 duration-300 animate-in zoom-in-50" strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <span className="flex gap-1" aria-hidden="true">
                <span className="kip-breathe size-1.5 rounded-full bg-current" />
                <span className="kip-breathe size-1.5 rounded-full bg-current [animation-delay:200ms]" />
                <span className="kip-breathe size-1.5 rounded-full bg-current [animation-delay:400ms]" />
              </span>
            )}
          </div>
        </div>
        <span
          className={cn(
            'mt-3 block text-center text-xs',
            perspective === 'get' ? 'font-semibold text-foreground' : 'text-muted-foreground',
          )}
        >
          {labels[1]}
        </span>
      </div>

      {/* NFC contact pulse where the phone tops meet */}
      {touching && (
        <div className="pointer-events-none absolute top-[22%] left-1/2" aria-hidden="true">
          <span className="kip-ripple absolute top-0 left-0 size-24 rounded-full border-2 border-primary" />
          <span className="kip-ripple absolute top-0 left-0 size-24 rounded-full border-2 border-primary [animation-delay:400ms]" />
          <span className="kip-ripple absolute top-0 left-0 size-24 rounded-full border-2 border-primary [animation-delay:800ms]" />
        </div>
      )}

      {/* Payment moving across */}
      {phase === 'transfer' && (
        <div className="pointer-events-none absolute top-1/2 left-1/2" aria-hidden="true">
          <span className="kip-transfer absolute -top-1.5 -left-1.5 size-3 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
        </div>
      )}
    </div>
  )
}
