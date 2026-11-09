'use client'

import { useState } from 'react'
import { Delete, Fingerprint, Lock } from 'lucide-react'
import { KipWordmark } from './kip-logo'
import { cn } from '@/lib/utils'
import { VAULT_ADDRESS, shortAddress } from '@/lib/wallet-data'

const PIN_LENGTH = 6

export function LockScreen({ onUnlock, onForgot }: { onUnlock: () => void; onForgot: () => void }) {
  const [pin, setPin] = useState('')

  const press = (digit: string) => {
    if (pin.length >= PIN_LENGTH) return
    const next = pin + digit
    setPin(next)
    if (next.length === PIN_LENGTH) setTimeout(onUnlock, 250)
  }

  const keyClass =
    'flex h-16 items-center justify-center rounded-full text-2xl font-medium text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary active:bg-muted'

  return (
    <div className="flex min-h-0 flex-1 flex-col px-6 pt-safe pb-safe">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <span className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold tracking-[0.14em] text-primary uppercase ring-1 ring-inset ring-primary/40">
          <Lock className="size-3.5" aria-hidden="true" />
          Vault sealed
        </span>
        <h1 className="py-1">
          <KipWordmark size={44} />
        </h1>
        <p className="max-w-64 text-sm leading-relaxed text-balance text-muted-foreground">
          {'Keys are encrypted in this phone’s hardware keystore.'}
        </p>
        <span className="rounded-full bg-card px-4 py-2 font-mono text-sm text-primary ring-1 ring-inset ring-border">
          {shortAddress(VAULT_ADDRESS)}
        </span>

        <div className="mt-6 flex flex-col items-center gap-4">
          <span className="text-sm font-medium" id="pin-label">
            Enter vault PIN
          </span>
          <div
            className="flex gap-3.5"
            role="progressbar"
            aria-labelledby="pin-label"
            aria-valuemin={0}
            aria-valuemax={PIN_LENGTH}
            aria-valuenow={pin.length}
          >
            {Array.from({ length: PIN_LENGTH }, (_, i) => (
              <span
                key={i}
                className={cn(
                  'size-3.5 rounded-full transition-colors',
                  i < pin.length ? 'bg-primary' : 'bg-muted ring-1 ring-inset ring-border',
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-72 grid-cols-3 gap-x-6 gap-y-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} type="button" className={keyClass} onClick={() => press(d)}>
            {d}
          </button>
        ))}
        <button type="button" aria-label="Unlock with biometrics" className={cn(keyClass, 'text-primary')} onClick={onUnlock}>
          <Fingerprint className="size-7" aria-hidden="true" />
        </button>
        <button type="button" className={keyClass} onClick={() => press('0')}>
          0
        </button>
        <button
          type="button"
          aria-label="Delete digit"
          className={cn(keyClass, 'text-muted-foreground')}
          onClick={() => setPin((p) => p.slice(0, -1))}
        >
          <Delete className="size-6" aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        onClick={onForgot}
        className="mx-auto mt-3 h-11 px-4 text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-primary"
      >
        Forgot PIN?
      </button>
    </div>
  )
}
