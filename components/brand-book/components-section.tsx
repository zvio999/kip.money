'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Eyebrow, InfoBox, KipButton, KipInput, Switch, TokenBadge, TokenChips, TxList } from '@/components/wallet/kip-ui'
import { TOKENS, TRANSACTIONS, type TokenSymbol } from '@/lib/wallet-data'
import { BookSection, Panel, PanelCaption } from './section'

export function ComponentsSection() {
  const [token, setToken] = useState<TokenSymbol>('USDT')
  const [direct, setDirect] = useState(true)

  return (
    <BookSection
      id="components"
      label="Components"
      title="Big targets, soft corners, one gold action."
      intro="These are the live components from the app. Buttons are 52 px tall with a 16 px radius so they are easy to hit with one thumb while holding two phones."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <KipButton>Unlock cold wallet</KipButton>
            <KipButton variant="secondary">Unlock with biometrics</KipButton>
            <KipButton variant="danger">Wipe cold wallet from device</KipButton>
            <KipButton variant="ghost">Forgot PIN?</KipButton>
          </div>
          <PanelCaption title="Buttons">
            Primary, secondary, danger, ghost. Stack vertically on phones; the primary action always sits on top.
          </PanelCaption>
        </Panel>

        <Panel className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            <TokenChips value={token} onChange={setToken} />
            <KipInput placeholder={`0.00 ${token}`} inputMode="decimal" aria-label={`Amount in ${token}`} />
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-background p-4 ring-1 ring-inset ring-border">
              <span className="flex flex-col">
                <span className="text-[15px] font-semibold">Direct sign</span>
                <span className="text-sm text-muted-foreground">Signs inside the hardware vault.</span>
              </span>
              <Switch checked={direct} onChange={setDirect} label="Direct sign" />
            </div>
          </div>
          <PanelCaption title="Inputs and selection">
            Chips for picking one of a few options, inputs with a gold focus ring, switches in green when on.
          </PanelCaption>
        </Panel>

        <Panel className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-3xl bg-background p-5 ring-1 ring-inset ring-primary/30">
            <div className="flex items-center justify-between">
              <Eyebrow>Total balance</Eyebrow>
              <Eye className="size-5 text-primary" aria-hidden="true" />
            </div>
            <span className="text-[44px] leading-none font-bold tracking-tight">$1.30</span>
            <span className="text-sm text-muted-foreground">BNB, USDT, USDC and FDUSD in USD</span>
          </div>
          <div className="flex gap-3">
            {TOKENS.map((t) => (
              <TokenBadge key={t.symbol} token={t} />
            ))}
          </div>
          <PanelCaption title="Cards and token badges">
            Cards are 24 px radius on card color. Featured cards get a thin gold ring; everything else uses Line.
          </PanelCaption>
        </Panel>

        <Panel className="flex flex-col gap-6">
          <TxList txs={TRANSACTIONS.slice(0, 3)} hidden={false} empty="No transactions yet." />
          <InfoBox>Hold this phone against the receiver. Payment sends on tap.</InfoBox>
          <PanelCaption title="History and info">
            Amounts in mono, green for received, red for sent. Info boxes explain a step in one or two sentences.
          </PanelCaption>
        </Panel>
      </div>
    </BookSection>
  )
}
