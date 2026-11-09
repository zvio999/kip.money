'use client'

import { useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Menu,
  Nfc,
  Plus,
  QrCode,
  RefreshCw,
  Send,
  ShieldCheck,
} from 'lucide-react'
import { Eyebrow, TokenBadge, masked } from './kip-ui'
import { KipWordmark } from './kip-logo'
import { TOKENS, VAULT_ADDRESS, formatAmount, formatUsd, shortAddress, totalUsd, type SheetState } from '@/lib/wallet-data'

const headerButton =
  'flex h-10 items-center gap-1.5 rounded-xl bg-card px-3 text-sm font-semibold text-primary ring-1 ring-inset ring-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

export function HomeScreen({
  hidden,
  onToggleHidden,
  onOpen,
  onLock,
}: {
  hidden: boolean
  onToggleHidden: () => void
  onOpen: (sheet: SheetState) => void
  onLock: () => void
}) {
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    await navigator.clipboard?.writeText(VAULT_ADDRESS).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background/95 px-5 pt-safe pb-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => onOpen({ name: 'menu' })}
            className="flex size-10 items-center justify-center rounded-xl bg-card text-primary ring-1 ring-inset ring-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <KipWordmark size={26} />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onOpen({ name: 'update' })} className={headerButton}>
            <RefreshCw className="size-4" aria-hidden="true" />
            Update
          </button>
          <button type="button" onClick={onLock} className={headerButton}>
            <Lock className="size-4" aria-hidden="true" />
            Lock
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-3 px-5 pb-safe">
        <section aria-labelledby="balance-label" className="rounded-3xl bg-card p-5 ring-1 ring-inset ring-border">
          <div className="flex items-center justify-between">
            <Eyebrow id="balance-label">Total balance</Eyebrow>
            <button
              type="button"
              onClick={onToggleHidden}
              aria-pressed={hidden}
              aria-label={hidden ? 'Show amounts' : 'Hide amounts'}
              className="-m-2 flex size-10 items-center justify-center rounded-full text-primary focus-visible:outline-2 focus-visible:outline-primary"
            >
              {hidden ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
            </button>
          </div>
          <p className="mt-3 font-mono text-4xl font-semibold tracking-tight tabular-nums">
            {masked(hidden, formatUsd(totalUsd))}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">BNB, USDT, USDC and FDUSD in USD</p>
        </section>

        <section
          aria-labelledby="tap-label"
          className="rounded-3xl bg-card p-5 ring-1 ring-inset ring-primary/35"
        >
          <div className="flex items-center gap-2">
            <Nfc className="size-4 text-primary" aria-hidden="true" />
            <Eyebrow id="tap-label" className="text-primary">
              Phone tap
            </Eyebrow>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Receiver opens Get. Sender opens Pay and taps phones.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onOpen({ name: 'pay' })}
              className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-primary-foreground transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98]"
            >
              <ArrowUpRight className="size-5" aria-hidden="true" />
              Pay
            </button>
            <button
              type="button"
              onClick={() => onOpen({ name: 'get' })}
              className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-muted text-lg font-bold text-primary ring-1 ring-inset ring-border transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98]"
            >
              <ArrowDownLeft className="size-5" aria-hidden="true" />
              Get
            </button>
          </div>
        </section>

        <section aria-labelledby="address-label" className="rounded-3xl bg-card p-5 ring-1 ring-inset ring-border">
          <div className="flex items-center justify-between gap-2">
            <Eyebrow id="address-label">BEP-20 vault address</Eyebrow>
            <span className="flex items-center gap-1 rounded-md bg-success/12 px-2 py-1 text-[11px] font-semibold text-success">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Secure keystore
            </span>
          </div>
          <button
            type="button"
            onClick={copyAddress}
            className="mt-3 flex w-full flex-col items-start gap-1.5 rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <span className="font-mono text-sm break-all text-foreground">{VAULT_ADDRESS}</span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-primary" aria-live="polite">
              <Copy className="size-3.5" aria-hidden="true" />
              {copied ? 'Address copied' : 'Tap address to copy'}
            </span>
          </button>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onOpen({ name: 'send', token: 'USDT' })}
              className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Send className="size-4" aria-hidden="true" />
              Send
            </button>
            <button
              type="button"
              onClick={() => onOpen({ name: 'receive', token: 'USDT' })}
              className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-muted text-sm font-semibold ring-1 ring-inset ring-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <QrCode className="size-4" aria-hidden="true" />
              Receive
            </button>
            <button
              type="button"
              onClick={() => onOpen({ name: 'token' })}
              className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-muted text-sm font-semibold ring-1 ring-inset ring-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Plus className="size-4" aria-hidden="true" />
              Token
            </button>
          </div>
        </section>

        <section aria-labelledby="assets-label" className="mt-3 flex flex-col gap-2">
          <h2 id="assets-label" className="flex items-baseline justify-between text-lg font-semibold">
            Assets
            <span className="text-xs font-medium text-muted-foreground">BNB Smart Chain</span>
          </h2>
          <ul className="flex flex-col gap-2">
            {TOKENS.map((token) => (
              <li key={token.symbol}>
                <button
                  type="button"
                  onClick={() => onOpen({ name: 'asset', token: token.symbol })}
                  className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left ring-1 ring-inset ring-border transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.99]"
                >
                  <TokenBadge token={token} />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-2">
                      <span className="text-[15px] font-bold">{token.symbol}</span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                        {token.kind}
                      </span>
                    </span>
                    <span className="truncate text-sm text-muted-foreground">{token.name}</span>
                    {token.contract && (
                      <span className="font-mono text-[11px] text-muted-foreground/80">
                        {shortAddress(token.contract)}
                      </span>
                    )}
                  </span>
                  <span className="flex flex-col items-end gap-0.5">
                    <span className="font-mono text-[15px] font-semibold tabular-nums">
                      {masked(hidden, formatAmount(token.balance))}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {masked(hidden, formatUsd(token.balance * token.usdPrice))}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
