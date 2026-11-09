import { BookSection, Panel, PanelCaption } from './section'

const scale = [
  { name: 'Balance', spec: '44 / Bold / −2%', className: 'text-[44px] font-bold leading-none tracking-tight', sample: '$1.30' },
  { name: 'Title', spec: '28 / Bold / −1%', className: 'text-[28px] font-bold leading-tight tracking-tight', sample: 'Kip Cold Wallet' },
  { name: 'Sheet title', spec: '20 / Semibold', className: 'text-xl font-semibold', sample: 'Transaction history' },
  { name: 'Body', spec: '15 / Regular / 1.5', className: 'text-[15px] leading-relaxed', sample: 'Hold this phone against the receiver. Payment sends on tap.' },
  { name: 'Label', spec: '12 / Semibold / +12% / caps', className: 'text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground', sample: 'Total balance' },
]

export function TypeSection() {
  return (
    <BookSection
      id="type"
      label="Typography"
      title="One sans for words. One mono for money."
      intro="Geist carries every sentence. Geist Mono is reserved for things people need to check character by character: addresses, amounts, versions."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Panel className="flex flex-col gap-6">
          <span className="text-8xl leading-none font-bold tracking-tight">Aa</span>
          <PanelCaption title="Geist">
            Regular 400, Medium 500, Semibold 600, Bold 700. Headings, body, buttons. Never below 14 px for body.
          </PanelCaption>
        </Panel>
        <Panel className="flex flex-col gap-6">
          <span className="font-mono text-8xl leading-none font-semibold tracking-tight text-primary">0x</span>
          <PanelCaption title="Geist Mono">
            Regular and Semibold. Wallet addresses, token amounts, contract IDs, version numbers. Always tabular figures.
          </PanelCaption>
        </Panel>
      </div>

      <Panel className="flex flex-col divide-y divide-border p-0">
        {scale.map((s) => (
          <div key={s.name} className="flex flex-col gap-3 px-6 py-6 md:flex-row md:items-center md:gap-10">
            <div className="flex w-44 shrink-0 flex-col gap-0.5">
              <span className="text-sm font-semibold">{s.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{s.spec}</span>
            </div>
            <span className={s.className}>{s.sample}</span>
          </div>
        ))}
        <div className="flex flex-col gap-3 px-6 py-6 md:flex-row md:items-center md:gap-10">
          <div className="flex w-44 shrink-0 flex-col gap-0.5">
            <span className="text-sm font-semibold">Address</span>
            <span className="font-mono text-xs text-muted-foreground">Mono 15 / Regular</span>
          </div>
          <span className="font-mono text-[15px] break-all text-primary">0xeDED244a15272012262a4aE4Ab482Abe0CaC3fda</span>
        </div>
      </Panel>
    </BookSection>
  )
}
