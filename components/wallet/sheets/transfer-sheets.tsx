'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Check, ClipboardPaste, Copy, Share2, TriangleAlert } from 'lucide-react'
import { BottomSheet } from '../bottom-sheet'
import { FieldLabel, InfoBox, KipButton, KipInput, TokenBadge, TokenChips, TxList, masked } from '../kip-ui'
import {
  TRANSACTIONS,
  VAULT_ADDRESS,
  formatAmount,
  formatUsd,
  getToken,
  isAddress,
  shortAddress,
  type SheetState,
  type TokenSymbol,
} from '@/lib/wallet-data'

export function AssetSheet({
  symbol,
  hidden,
  onClose,
  onOpen,
}: {
  symbol: TokenSymbol
  hidden: boolean
  onClose: () => void
  onOpen: (sheet: SheetState) => void
}) {
  const token = getToken(symbol)
  const txs = TRANSACTIONS.filter((t) => t.token === symbol)
  return (
    <BottomSheet title={token.symbol} onClose={onClose}>
      <div className="flex items-center gap-4">
        <TokenBadge token={token} size="lg" />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-muted-foreground">
            {token.name} · {token.kind}
          </span>
          <span className="font-mono text-2xl font-semibold tabular-nums">
            {masked(hidden, formatAmount(token.balance))} {token.symbol}
          </span>
          <span className="font-mono text-sm text-muted-foreground tabular-nums">
            {masked(hidden, formatUsd(token.balance * token.usdPrice))}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <KipButton onClick={() => onOpen({ name: 'send', token: symbol })}>Send</KipButton>
        <KipButton variant="secondary" onClick={() => onOpen({ name: 'receive', token: symbol })}>
          Receive
        </KipButton>
      </div>
      <section className="flex flex-col gap-1">
        <h3 className="text-base font-semibold">Transaction history</h3>
        <TxList txs={txs} hidden={hidden} empty={`No ${token.symbol} transactions yet.`} />
      </section>
    </BottomSheet>
  )
}

const BNB_FEE = 0.000021

export function SendSheet({
  initialToken,
  directSign,
  onClose,
}: {
  initialToken: TokenSymbol
  directSign: boolean
  onClose: () => void
}) {
  const [symbol, setSymbol] = useState(initialToken)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [sent, setSent] = useState(false)
  const token = getToken(symbol)
  const value = Number.parseFloat(amount)
  const amountValid = Number.isFinite(value) && value > 0 && value <= token.balance
  const recipientValid = isAddress(recipient)
  const showAddressError = recipient.length > 0 && !recipientValid
  const showAmountError = amount.length > 0 && Number.isFinite(value) && value > token.balance

  const paste = async () => {
    const text = await navigator.clipboard?.readText().catch(() => '')
    if (text) setRecipient(text.trim())
  }

  if (sent) {
    return (
      <BottomSheet title="Sent" onClose={onClose}>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
            <Check className="size-8" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <p className="font-mono text-2xl font-semibold">
            {value} {symbol}
          </p>
          <p className="text-sm text-muted-foreground">
            To <span className="font-mono">{shortAddress(recipient)}</span> on BNB Smart Chain
          </p>
        </div>
        <KipButton onClick={onClose}>Done</KipButton>
      </BottomSheet>
    )
  }

  return (
    <BottomSheet title={`Send ${symbol}`} onClose={onClose}>
      <TokenChips value={symbol} onChange={setSymbol} />

      <div className="flex flex-col gap-2.5">
        <FieldLabel htmlFor="send-to">Recipient address</FieldLabel>
        <div className="relative">
          <KipInput
            id="send-to"
            placeholder="0x…"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value.trim())}
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={showAddressError}
            aria-describedby="send-to-hint"
            className="pr-24 font-mono text-sm"
          />
          <button
            type="button"
            onClick={paste}
            className="absolute top-1/2 right-2 flex h-9 -translate-y-1/2 items-center gap-1.5 rounded-xl bg-muted px-3 text-xs font-semibold text-primary focus-visible:outline-2 focus-visible:outline-primary"
          >
            <ClipboardPaste className="size-3.5" aria-hidden="true" />
            Paste
          </button>
        </div>
        <p id="send-to-hint" className={showAddressError ? 'text-xs text-destructive' : 'text-xs text-muted-foreground'}>
          {showAddressError ? 'Enter a valid 0x address (42 characters).' : 'BEP-20 address on BNB Smart Chain only.'}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="send-amount">Amount ({symbol})</FieldLabel>
          <button
            type="button"
            onClick={() => setAmount(String(token.balance))}
            className="text-xs font-semibold text-primary"
          >
            Max {formatAmount(token.balance)}
          </button>
        </div>
        <KipInput
          id="send-amount"
          inputMode="decimal"
          placeholder={`0.00 ${symbol}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
          aria-invalid={showAmountError}
          className="font-mono text-lg"
        />
        {showAmountError && <p className="text-xs text-destructive">More than your {symbol} balance.</p>}
      </div>

      <dl className="flex flex-col gap-2 rounded-2xl bg-background p-4 text-sm ring-1 ring-inset ring-border">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Network fee</dt>
          <dd className="font-mono">{`≈ ${BNB_FEE} BNB`}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Signing</dt>
          <dd>{directSign ? 'Direct Sign' : 'PIN required'}</dd>
        </div>
      </dl>

      <KipButton disabled={!amountValid || !recipientValid} onClick={() => setSent(true)}>
        {directSign ? 'Sign and send' : 'Continue to PIN'}
      </KipButton>
    </BottomSheet>
  )
}

export function ReceiveSheet({ initialToken, onClose }: { initialToken: TokenSymbol; onClose: () => void }) {
  const [symbol, setSymbol] = useState(initialToken)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard?.writeText(VAULT_ADDRESS).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const share = () => {
    navigator.share?.({ text: VAULT_ADDRESS }).catch(() => {})
  }

  return (
    <BottomSheet title={`Receive ${symbol}`} onClose={onClose}>
      <TokenChips value={symbol} onChange={setSymbol} />
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-3xl bg-foreground p-4">
          <QRCodeSVG
            value={VAULT_ADDRESS}
            size={196}
            bgColor="#f3f4f6"
            fgColor="#0b0f19"
            level="M"
            title={`QR code for vault address ${VAULT_ADDRESS}`}
          />
        </div>
        <p className="max-w-72 text-center font-mono text-sm break-all">{VAULT_ADDRESS}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <KipButton onClick={copy} aria-live="polite">
          <Copy className="size-4" aria-hidden="true" />
          {copied ? 'Copied' : 'Copy'}
        </KipButton>
        <KipButton variant="secondary" onClick={share}>
          <Share2 className="size-4" aria-hidden="true" />
          Share
        </KipButton>
      </div>
      <InfoBox className="flex gap-3">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <span>Only send {symbol} on BNB Smart Chain (BEP-20) to this address. Other networks may be lost.</span>
      </InfoBox>
    </BottomSheet>
  )
}

export function AddTokenSheet({ onClose }: { onClose: () => void }) {
  const [contract, setContract] = useState('')
  const valid = isAddress(contract)
  return (
    <BottomSheet title="Add token" onClose={onClose}>
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        Paste a BEP-20 contract address. kip reads the name and decimals from BNB Smart Chain.
      </p>
      <div className="flex flex-col gap-2.5">
        <FieldLabel htmlFor="token-contract">Contract address</FieldLabel>
        <KipInput
          id="token-contract"
          placeholder="0x…"
          value={contract}
          onChange={(e) => setContract(e.target.value.trim())}
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
          className="font-mono text-sm"
        />
      </div>
      <InfoBox>Anyone can create a token with any name. Only add contracts you got from a source you trust.</InfoBox>
      <KipButton disabled={!valid} onClick={onClose}>
        Add token
      </KipButton>
    </BottomSheet>
  )
}
