'use client'

import { useState } from 'react'
import { ChevronRight, Fingerprint, History, KeyRound, Loader2, ShieldAlert } from 'lucide-react'
import { BottomSheet } from '../bottom-sheet'
import { Chip, FieldLabel, InfoBox, KipButton, KipInput, Switch, TxList } from '../kip-ui'
import { WordDisplayGrid } from '../word-grid'
import { APP_VERSION, SAMPLE_PHRASE, TRANSACTIONS, type SheetState, type TokenSymbol } from '@/lib/wallet-data'

export function MenuSheet({
  directSign,
  onDirectSign,
  onClose,
  onOpen,
}: {
  directSign: boolean
  onDirectSign: (value: boolean) => void
  onClose: () => void
  onOpen: (sheet: SheetState) => void
}) {
  const rows = [
    { label: 'Vault key', hint: 'Recovery phrase, updates, wipe', icon: KeyRound, sheet: { name: 'vault' } as const },
    { label: 'Transaction history', hint: 'Filter by token and type', icon: History, sheet: { name: 'history' } as const },
  ]
  return (
    <BottomSheet title="Menu" onClose={onClose}>
      <div className="flex items-center gap-4 rounded-2xl bg-background p-4 ring-1 ring-inset ring-border">
        <div className="flex flex-1 flex-col gap-1">
          <span id="direct-sign-label" className="text-[15px] font-semibold">
            Direct Sign
          </span>
          <span className="text-sm leading-relaxed text-muted-foreground">
            Signs inside the hardware vault and broadcasts directly to BNB Smart Chain.
          </span>
        </div>
        <Switch checked={directSign} onChange={onDirectSign} label="Direct Sign" />
      </div>
      <ul className="flex flex-col gap-2">
        {rows.map(({ label, hint, icon: Icon, sheet }) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => onOpen(sheet)}
              className="flex w-full items-center gap-4 rounded-2xl bg-muted p-4 text-left ring-1 ring-inset ring-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="flex flex-1 flex-col">
                <span className="text-[15px] font-semibold">{label}</span>
                <span className="text-xs text-muted-foreground">{hint}</span>
              </span>
              <ChevronRight className="size-5 text-muted-foreground" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </BottomSheet>
  )
}

export function HistorySheet({ hidden, onClose }: { hidden: boolean; onClose: () => void }) {
  const [token, setToken] = useState<'All' | TokenSymbol>('All')
  const [type, setType] = useState<'All' | 'received' | 'sent'>('All')
  const txs = TRANSACTIONS.filter((t) => (token === 'All' || t.token === token) && (type === 'All' || t.type === type))

  return (
    <BottomSheet title="Transaction history" onClose={onClose}>
      <fieldset>
        <legend className="mb-2.5 text-sm font-medium">Token</legend>
        <div className="flex flex-wrap gap-2">
          {(['All', 'BNB', 'USDT', 'USDC', 'FDUSD'] as const).map((t) => (
            <Chip key={t} active={token === t} onClick={() => setToken(t)}>
              {t}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2.5 text-sm font-medium">Type</legend>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['All', 'All'],
              ['received', 'Received'],
              ['sent', 'Sent'],
            ] as const
          ).map(([value, label]) => (
            <Chip key={value} active={type === value} onClick={() => setType(value)}>
              {label}
            </Chip>
          ))}
        </div>
      </fieldset>
      <TxList txs={txs} hidden={hidden} empty="No transactions match these filters." />
    </BottomSheet>
  )
}

export function VaultKeySheet({
  onClose,
  onOpen,
  onWipe,
}: {
  onClose: () => void
  onOpen: (sheet: SheetState) => void
  onWipe: () => void
}) {
  const [pin, setPin] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [confirmWipe, setConfirmWipe] = useState(false)

  return (
    <BottomSheet title="Vault key" onClose={onClose}>
      <p className="text-[15px] leading-relaxed text-pretty text-muted-foreground">
        Your recovery phrase and private key are encrypted in this phone’s hardware keystore. Authenticate to view
        your offline backup.
      </p>

      {revealed ? (
        <div className="flex flex-col gap-3">
          <WordDisplayGrid words={SAMPLE_PHRASE} />
          <InfoBox className="flex gap-3">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
            <span>Anyone who sees these words can take your funds. Hide them when you are done.</span>
          </InfoBox>
          <KipButton variant="secondary" onClick={() => setRevealed(false)}>
            Hide recovery phrase
          </KipButton>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2.5">
            <FieldLabel htmlFor="vault-pin">Vault PIN</FieldLabel>
            <KipInput
              id="vault-pin"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={6}
              placeholder="6-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="font-mono tracking-[0.3em]"
            />
          </div>
          <KipButton disabled={pin.length !== 6} onClick={() => setRevealed(true)}>
            Reveal recovery phrase
          </KipButton>
          <KipButton variant="secondary" onClick={() => setRevealed(true)}>
            <Fingerprint className="size-5" aria-hidden="true" />
            Reveal with biometrics
          </KipButton>
        </div>
      )}

      <hr className="border-border" />

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-base font-semibold">App updates</h3>
            <span className="text-sm text-muted-foreground">Version {APP_VERSION} · preview</span>
          </div>
          <button
            type="button"
            onClick={() => onOpen({ name: 'update' })}
            className="h-10 rounded-xl bg-muted px-4 text-sm font-semibold text-primary ring-1 ring-inset ring-border"
          >
            Check
          </button>
        </div>
      </section>

      <hr className="border-border" />

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-destructive">Danger zone</h3>
        {confirmWipe && (
          <p className="text-sm leading-relaxed text-muted-foreground" role="alert">
            This deletes the keys from this phone. Without your 12 words the funds cannot be recovered.
          </p>
        )}
        <KipButton variant="danger" onClick={() => (confirmWipe ? onWipe() : setConfirmWipe(true))}>
          {confirmWipe ? 'Tap again to wipe' : 'Wipe wallet from this device'}
        </KipButton>
      </section>
    </BottomSheet>
  )
}

export function UpdateSheet({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<'idle' | 'checking' | 'latest'>('idle')

  const check = () => {
    setState('checking')
    setTimeout(() => setState('latest'), 1400)
  }

  return (
    <BottomSheet title="Wallet update" onClose={onClose}>
      <p className="text-[15px] leading-relaxed text-pretty text-muted-foreground">
        Download new wallet code without reinstalling. Private keys stay in this phone’s hardware vault.
      </p>
      <div className="flex flex-col gap-1.5 rounded-2xl bg-background p-4 ring-1 ring-inset ring-border">
        <span className="text-sm font-medium text-muted-foreground">Installed version</span>
        <span className="font-mono text-lg text-primary">
          {APP_VERSION} · channel preview
        </span>
        <span className="font-mono text-xs text-muted-foreground">Runtime {APP_VERSION}</span>
      </div>
      <InfoBox role="status" aria-live="polite">
        {state === 'idle' && 'Tap Check for updates to download the latest wallet code over the air.'}
        {state === 'checking' && 'Checking for a newer version…'}
        {state === 'latest' && `You are on the latest version (${APP_VERSION}).`}
      </InfoBox>
      <KipButton onClick={check} disabled={state === 'checking'}>
        {state === 'checking' && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
        {state === 'checking' ? 'Checking' : 'Check for updates'}
      </KipButton>
    </BottomSheet>
  )
}
