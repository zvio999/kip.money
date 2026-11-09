'use client'

import { useState } from 'react'
import { Check, EyeOff, ShieldAlert } from 'lucide-react'
import { InfoBox, KipButton } from './kip-ui'
import { KipWordmark } from './kip-logo'
import { TapAnimation, useTapLoop } from './tap-animation'
import { FlowHeader, WordDisplayGrid, WordInputGrid } from './word-grid'
import { cn } from '@/lib/utils'
import { SAMPLE_PHRASE } from '@/lib/wallet-data'

export function WelcomeScreen({ onCreate, onImport }: { onCreate: () => void; onImport: () => void }) {
  const phase = useTapLoop()
  return (
    <div className="flex min-h-0 flex-1 flex-col px-6 pt-safe pb-safe">
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <TapAnimation phase={phase} />
        <h1 className="mt-4">
          <KipWordmark size={52} />
        </h1>
        <p className="max-w-72 text-base leading-relaxed text-balance text-muted-foreground">
          A cold wallet that lives on your phone. Pay by tapping phones together.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <KipButton onClick={onCreate}>Create new wallet</KipButton>
        <KipButton variant="secondary" onClick={onImport}>
          Import recovery phrase
        </KipButton>
        <p className="pt-2 text-center text-xs leading-relaxed text-muted-foreground">
          No account, no sign-in. Your keys are created and stay on this device.
        </p>
      </div>
    </div>
  )
}

export function CreateWalletScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [revealed, setRevealed] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-safe">
      <FlowHeader title="Recovery phrase" onBack={onBack} />
      <h2 className="text-2xl font-bold tracking-tight text-balance">Write these 12 words on paper</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        They are the only way to restore this wallet. kip cannot recover them for you.
      </p>

      <div className="relative mt-5">
        <div className={cn('transition-[filter]', !revealed && 'pointer-events-none blur-md select-none')} aria-hidden={!revealed}>
          <WordDisplayGrid words={SAMPLE_PHRASE} />
        </div>
        {!revealed && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl text-sm font-semibold focus-visible:outline-2 focus-visible:outline-primary"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-card ring-1 ring-border">
              <EyeOff className="size-5 text-primary" aria-hidden="true" />
            </span>
            Tap to reveal
            <span className="text-xs font-normal text-muted-foreground">Make sure no one can see your screen</span>
          </button>
        )}
      </div>

      <InfoBox className="mt-4 flex gap-3">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <span>Never screenshot, type into a website, or share these words. Anyone with them controls your funds.</span>
      </InfoBox>

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <button
          type="button"
          role="checkbox"
          aria-checked={confirmed}
          disabled={!revealed}
          onClick={() => setConfirmed((c) => !c)}
          className="flex items-center gap-3 rounded-2xl p-1 text-left text-sm disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-primary"
        >
          <span
            className={cn(
              'flex size-6 shrink-0 items-center justify-center rounded-md ring-1 ring-inset',
              confirmed ? 'bg-primary text-primary-foreground ring-primary' : 'ring-border',
            )}
          >
            {confirmed && <Check className="size-4" strokeWidth={3} aria-hidden="true" />}
          </span>
          I wrote down all 12 words, in order, offline.
        </button>
        <KipButton disabled={!confirmed} onClick={onDone}>
          Continue to set PIN
        </KipButton>
      </div>
    </div>
  )
}

export function ImportWalletScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [words, setWords] = useState<string[]>(Array(12).fill(''))
  const complete = words.every((w) => w.length > 0)

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-safe">
      <FlowHeader title="Import wallet" onBack={onBack} />
      <h2 className="text-2xl font-bold tracking-tight text-balance">Enter your recovery phrase</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        One word per box. Pasting all 12 into the first box fills the rest.
      </p>
      <div className="mt-5">
        <WordInputGrid words={words} onChange={setWords} />
      </div>
      <div className="mt-auto flex flex-col gap-3 pt-6">
        <p className="text-center text-xs text-muted-foreground">Checked on this device only. Nothing is uploaded.</p>
        <KipButton disabled={!complete} onClick={onDone}>
          Import wallet
        </KipButton>
      </div>
    </div>
  )
}

export function ForgotPinScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [words, setWords] = useState<string[]>(Array(12).fill(''))
  const complete = words.every((w) => w.length > 0)

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-safe">
      <FlowHeader title="Forgot PIN" onBack={onBack} />
      <h2 className="text-2xl font-bold tracking-tight text-balance">Prove it’s your wallet</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Enter your 12-word recovery phrase to set a new vault PIN. Your funds stay where they are.
      </p>
      <div className="mt-5">
        <WordInputGrid words={words} onChange={setWords} />
      </div>
      <div className="mt-auto pt-6">
        <KipButton disabled={!complete} onClick={onDone}>
          Verify and set new PIN
        </KipButton>
      </div>
    </div>
  )
}
