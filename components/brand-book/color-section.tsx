import { cn } from '@/lib/utils'
import { BookSection, Panel, PanelCaption } from './section'

const core = [
  { name: 'kip gold', token: '--primary', hex: '#F3BA2F', rgb: '243 186 47', swatch: 'bg-primary', ink: 'text-primary-foreground', role: 'Primary actions, the logo, focus rings.' },
  { name: 'Vault', token: '--background', hex: '#0B0F19', rgb: '11 15 25', swatch: 'bg-background ring-1 ring-inset ring-border', ink: 'text-foreground', role: 'App background. The safe.' },
  { name: 'Card', token: '--card', hex: '#111827', rgb: '17 24 39', swatch: 'bg-card ring-1 ring-inset ring-border', ink: 'text-foreground', role: 'Sheets, cards, raised surfaces.' },
  { name: 'Line', token: '--border', hex: '#1F2937', rgb: '31 41 55', swatch: 'bg-muted', ink: 'text-foreground', role: 'Borders, secondary buttons, inputs.' },
  { name: 'Paper', token: '--foreground', hex: '#F3F4F6', rgb: '243 244 246', swatch: 'bg-foreground', ink: 'text-background', role: 'Primary text.' },
  { name: 'Mist', token: '--muted-foreground', hex: '#9CA3AF', rgb: '156 163 175', swatch: 'bg-muted-foreground', ink: 'text-background', role: 'Secondary text, labels, hints.' },
]

const signal = [
  { name: 'Received', token: '--success', hex: '#22C55E', swatch: 'bg-success', role: 'Incoming funds, toggles on, verified states.' },
  { name: 'Sent / Danger', token: '--destructive', hex: '#F05252', swatch: 'bg-destructive', role: 'Outgoing funds, errors, wipe wallet.' },
]

const proportions = [
  { label: 'Vault', share: 'basis-[64%]', className: 'bg-background ring-1 ring-inset ring-border' },
  { label: 'Card', share: 'basis-[22%]', className: 'bg-card' },
  { label: 'Line', share: 'basis-[6%]', className: 'bg-muted' },
  { label: 'Gold', share: 'basis-[8%]', className: 'bg-primary' },
]

export function ColorSection() {
  return (
    <BookSection
      id="color"
      label="Color"
      title="Mostly vault. A little gold."
      intro="Gold means “do this”. If everything is gold, nothing is. One gold button per screen is the rule; two is the exception."
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {core.map((c) => (
          <li key={c.hex}>
            <Panel className="flex h-full flex-col gap-4 p-4">
              <div className={cn('flex h-28 items-end rounded-2xl p-4', c.swatch)}>
                <span className={cn('text-lg font-bold', c.ink)}>{c.name}</span>
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 px-1 font-mono text-xs">
                <dt className="text-muted-foreground">HEX</dt>
                <dd>{c.hex}</dd>
                <dt className="text-muted-foreground">RGB</dt>
                <dd>{c.rgb}</dd>
                <dt className="text-muted-foreground">Token</dt>
                <dd>{c.token}</dd>
              </dl>
              <p className="px-1 text-sm leading-relaxed text-muted-foreground">{c.role}</p>
            </Panel>
          </li>
        ))}
      </ul>

      <div className="grid gap-4 md:grid-cols-2">
        {signal.map((s) => (
          <Panel key={s.hex} className="flex items-center gap-5">
            <span className={cn('size-16 shrink-0 rounded-2xl', s.swatch)} aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <span className="font-semibold">{s.name}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {s.hex} · {s.token}
              </span>
              <span className="text-sm text-muted-foreground">{s.role}</span>
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="flex flex-col gap-5">
        <div className="flex h-16 gap-1 overflow-hidden rounded-2xl" role="img" aria-label="Color proportions: vault 64%, card 22%, line 6%, gold 8%">
          {proportions.map((p) => (
            <div key={p.label} className={cn('flex shrink-0 grow-0 items-end p-3', p.share, p.className)}>
              <span className={cn('font-mono text-xs', p.label === 'Gold' ? 'text-primary-foreground' : 'text-muted-foreground')}>
                {p.label}
              </span>
            </div>
          ))}
        </div>
        <PanelCaption title="Proportion">
          Green and red are signals, not decoration — they only appear next to an amount or a state. Token colors (USDT
          green, USDC blue) belong to those tokens and stay inside their badges.
        </PanelCaption>
      </Panel>
    </BookSection>
  )
}
