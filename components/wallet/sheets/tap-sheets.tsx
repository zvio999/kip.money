'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import { Delete } from 'lucide-react'
import { BottomSheet } from '../bottom-sheet'
import { InfoBox, KipButton, TokenChips } from '../kip-ui'
import { TapAnimation, useTapLoop, type TapPhase } from '../tap-animation'
import { cn } from '@/lib/utils'
import { formatUsd, getToken, type TokenSymbol } from '@/lib/wallet-data'

const paySteps = [
  { title: 'Hold phones back to back', body: 'Line up the top of your phone with the top of the receiver’s phone.' },
  { title: 'Keep them together', body: 'kip signs the payment on this device. Your keys never leave it.' },
  { title: 'Wait for the confirmation', body: 'Your phone vibrates when the payment has been sent.' },
]

function stepForPhase(phase: TapPhase) {
  if (phase === 'apart' || phase === 'approach') return 0
  if (phase === 'contact' || phase === 'transfer') return 1
  return 2
}

const payStatus: Record<TapPhase, string> = {
  apart: 'Ready to tap',
  approach: 'Bring phones closer',
  contact: 'Connected',
  transfer: 'Sending payment…',
  done: 'Payment sent',
}

const getStatus: Record<TapPhase, string> = {
  apart: 'Waiting for the sender',
  approach: 'Waiting for the sender',
  contact: 'Phone detected',
  transfer: 'Receiving payment…',
  done: 'Payment received',
}

function TapStatus({ phase, text }: { phase: TapPhase; text: Record<TapPhase, string> }) {
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        'text-center text-sm font-semibold transition-colors',
        phase === 'done' ? 'text-success' : 'text-foreground',
      )}
    >
      {text[phase]}
    </p>
  )
}

export function PaySheet({ onClose, directSign }: { onClose: () => void; directSign: boolean }) {
  const phase = useTapLoop()
  const activeStep = stepForPhase(phase)

  return (
    <BottomSheet title="Pay" onClose={onClose}>
      <p className="text-[15px] leading-relaxed text-pretty text-muted-foreground">
        Hold this phone against the receiver. The amount comes from their Get screen.
      </p>

      <div className="flex flex-col gap-1">
        <TapAnimation phase={phase} perspective="pay" caption="Pay" />
        <TapStatus phase={phase} text={payStatus} />
      </div>

      <ol className="flex flex-col gap-1">
        {paySteps.map((step, i) => {
          const isActive = i === activeStep
          return (
            <li
              key={step.title}
              aria-current={isActive ? 'step' : undefined}
              className={cn(
                'flex gap-3 rounded-2xl p-3 transition-all duration-500',
                isActive ? 'bg-background opacity-100 ring-1 ring-inset ring-border' : 'opacity-45',
              )}
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold transition-colors duration-500',
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                )}
              >
                {i + 1}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">{step.title}</span>
                <span className="text-xs leading-relaxed text-pretty text-muted-foreground">{step.body}</span>
              </span>
            </li>
          )
        })}
      </ol>

      <InfoBox>
        {directSign
          ? 'Direct Sign is on. The payment sends on tap without a PIN prompt.'
          : 'Direct Sign is off. You will confirm with your PIN after the tap.'}
      </InfoBox>
    </BottomSheet>
  )
}

export function GetSheet({ onClose }: { onClose: () => void }) {
  const [token, setToken] = useState<TokenSymbol>('USDT')
  const [amount, setAmount] = useState('')
  const [ready, setReady] = useState(false)
  const value = Number.parseFloat(amount)
  const valid = Number.isFinite(value) && value > 0

  return (
    <BottomSheet title={`Get ${token}`} onClose={onClose}>
      {ready ? (
        <GetWaiting token={token} amount={value} onEdit={() => setReady(false)} />
      ) : (
        <>
          <p className="text-[15px] leading-relaxed text-pretty text-muted-foreground">
            {'Pick a token and type the amount, then tap Ready.'}
          </p>
          <TokenChips value={token} onChange={setToken} />
          <AmountDisplay token={token} amount={amount} />
          <AmountKeypad onKey={(key) => setAmount((current) => applyKey(current, key))} />
          <KipButton disabled={!valid} onClick={() => setReady(true)}>
            Ready — wait for tap
          </KipButton>
        </>
      )}
    </BottomSheet>
  )
}

type AmountKey = string | 'delete'

const MAX_INTEGER_DIGITS = 9
const MAX_DECIMALS = 6

function applyKey(current: string, key: AmountKey) {
  if (key === 'delete') return current.slice(0, -1)
  if (key === '.') {
    if (current.includes('.')) return current
    return current === '' ? '0.' : `${current}.`
  }
  const [whole, fraction] = current.split('.')
  if (fraction !== undefined) {
    return fraction.length >= MAX_DECIMALS ? current : current + key
  }
  if (whole === '0') return key
  return whole.length >= MAX_INTEGER_DIGITS ? current : current + key
}

function AmountDisplay({ token, amount }: { token: TokenSymbol; amount: string }) {
  const value = Number.parseFloat(amount)
  const usd = Number.isFinite(value) ? value * getToken(token).usdPrice : 0
  const empty = amount === ''

  return (
    <div className="flex flex-col items-center gap-1 py-2 text-center" role="status" aria-live="polite">
      <span className="text-sm text-muted-foreground">Amount to get</span>
      <span
        className={cn(
          'max-w-full truncate font-mono text-5xl font-semibold tracking-tight tabular-nums',
          empty ? 'text-muted-foreground/50' : 'text-foreground',
        )}
      >
        {empty ? '0' : amount}
        <span className="ml-2 text-2xl text-primary">{token}</span>
      </span>
      <span className="font-mono text-sm text-muted-foreground">{`≈ ${formatUsd(usd)}`}</span>
    </div>
  )
}

const amountKeyClass =
  'flex h-14 items-center justify-center rounded-full font-mono text-2xl font-medium text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary active:bg-muted'

function AmountKeypad({ onKey }: { onKey: (key: AmountKey) => void }) {
  const handleKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (/^[0-9]$/.test(e.key)) onKey(e.key)
    else if (e.key === '.' || e.key === ',') onKey('.')
    else if (e.key === 'Backspace') onKey('delete')
    else return
    e.preventDefault()
  })

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKeyDown(e)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  return (
    <div className="mx-auto grid w-full max-w-72 grid-cols-3 gap-x-6 gap-y-1" aria-label="Amount keypad" role="group">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((d) => (
        <button
          key={d}
          type="button"
          aria-label={d === '.' ? 'Decimal point' : undefined}
          className={amountKeyClass}
          onClick={() => onKey(d)}
        >
          {d}
        </button>
      ))}
      <button
        type="button"
        aria-label="Delete digit"
        className={cn(amountKeyClass, 'text-muted-foreground')}
        onClick={() => onKey('delete')}
      >
        <Delete className="size-6" aria-hidden="true" />
      </button>
    </div>
  )
}

function GetWaiting({ token, amount, onEdit }: { token: TokenSymbol; amount: number; onEdit: () => void }) {
  const phase = useTapLoop()
  const usd = amount * getToken(token).usdPrice
  return (
    <>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-sm text-muted-foreground">Requesting</span>
        <span className="font-mono text-4xl font-semibold tracking-tight tabular-nums">
          {amount} <span className="text-primary">{token}</span>
        </span>
        <span className="font-mono text-sm text-muted-foreground">{`≈ ${formatUsd(usd)}`}</span>
      </div>
      <div className="flex flex-col gap-1">
        <TapAnimation phase={phase} perspective="get" caption="Pay" />
        <TapStatus phase={phase} text={getStatus} />
      </div>
      <KipButton variant="secondary" onClick={onEdit}>
        Change amount
      </KipButton>
    </>
  )
}
