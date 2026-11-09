import { KIP_CHEVRON, KIP_STEM, KipMark, KipWordmark } from '@/components/wallet/kip-logo'
import { BookSection, Panel, PanelCaption } from './section'

const gridLines = Array.from({ length: 9 }, (_, i) => i * 8)

function ConstructionDiagram() {
  return (
    <svg viewBox="-6 -6 76 76" role="img" aria-labelledby="construction-title" className="w-full max-w-sm">
      <title id="construction-title">
        kip mark on a 64 unit grid: a 9 by 40 stem and a chevron with a 9 unit stroke, separated by a 5 unit gap
      </title>
      <rect x="0" y="0" width="64" height="64" rx="16" className="fill-primary" />
      {gridLines.map((v) => (
        <g key={v} className="stroke-primary-foreground/15" strokeWidth={0.25}>
          <line x1={v} y1={0} x2={v} y2={64} />
          <line x1={0} y1={v} x2={64} y2={v} />
        </g>
      ))}
      <rect {...KIP_STEM} className="fill-primary-foreground/85" />
      <path
        d={KIP_CHEVRON}
        className="stroke-primary-foreground/85"
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <g className="stroke-foreground" strokeWidth={0.4}>
        <line x1={23} y1={58} x2={28} y2={58} />
        <line x1={23} y1={56.5} x2={23} y2={59.5} />
        <line x1={28} y1={56.5} x2={28} y2={59.5} />
      </g>
      <text x={25.5} y={63} textAnchor="middle" className="fill-foreground font-mono" fontSize={3}>
        gap 5
      </text>
      <text x={18.5} y={8.5} textAnchor="middle" className="fill-primary-foreground font-mono" fontSize={3}>
        9 × 40
      </text>
      <text x={-2} y={33} textAnchor="end" className="fill-muted-foreground font-mono" fontSize={3}>
        64
      </text>
    </svg>
  )
}

const sizes = [96, 64, 48, 32, 24, 16]

export function LogoSection() {
  return (
    <BookSection
      id="logo"
      label="Logo"
      title="Two phones, one second apart."
      intro="The stem is your phone. The chevron is theirs, leaning in. The 5 unit gap is the moment right before the tap, and it is never closed in the static logo."
    >
      <div className="grid gap-4 lg:grid-cols-5">
        <Panel className="flex flex-col items-center justify-center gap-6 lg:col-span-3">
          <ConstructionDiagram />
          <PanelCaption title="Construction">
            Drawn on a 64 unit grid with a 16 unit corner radius. Stem 9 × 40, chevron stroke 9 with round caps. Export
            from the SVG source only — never redraw by hand.
          </PanelCaption>
        </Panel>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <Panel className="flex flex-col gap-5">
            <div className="flex justify-center py-4">
              <div className="rounded-xl p-[18px] outline-1 outline-dashed outline-primary/60">
                <KipMark size={96} />
              </div>
            </div>
            <PanelCaption title="Clear space">
              Keep empty space around the mark equal to the stem width (9 / 64 of the mark). Nothing enters that zone.
            </PanelCaption>
          </Panel>
          <Panel className="flex flex-col gap-5">
            <div className="flex items-end justify-between">
              {sizes.map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <KipMark size={s} />
                  <span className="font-mono text-xs text-muted-foreground">{s}</span>
                </div>
              ))}
            </div>
            <PanelCaption title="Minimum size">
              16 px on screen, 6 mm in print. Below that, use the wordmark alone.
            </PanelCaption>
          </Panel>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Panel className="flex flex-col gap-6">
          <div className="flex h-32 items-center justify-center rounded-2xl bg-background">
            <KipMark size={80} tone="gold" />
          </div>
          <PanelCaption title="Gold — primary">App icon, splash, store listing. The default everywhere.</PanelCaption>
        </Panel>
        <Panel className="flex flex-col gap-6">
          <div className="flex h-32 items-center justify-center rounded-2xl bg-card ring-1 ring-inset ring-border">
            <KipMark size={80} tone="vault" />
          </div>
          <PanelCaption title="Vault">Gold glyph on vault black for dark headers and the lock screen.</PanelCaption>
        </Panel>
        <Panel className="flex flex-col gap-6">
          <div className="flex h-32 items-center justify-center rounded-2xl bg-background">
            <KipMark size={80} tone="outline" />
          </div>
          <PanelCaption title="Outline">Small in-app badges where a solid gold block would be too loud.</PanelCaption>
        </Panel>
      </div>

      <Panel className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-12">
          <KipWordmark size={56} />
          <KipWordmark size={32} tone="vault" />
        </div>
        <div className="max-w-sm">
          <PanelCaption title="Wordmark">
            Always lowercase “kip”, Geist Bold, tracking −2%. Gap between mark and word is 28% of the mark size. Never
            write “KIP” or “Kip” in the logo.
          </PanelCaption>
        </div>
      </Panel>
    </BookSection>
  )
}
