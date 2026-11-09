import { Download } from 'lucide-react'
import { Eyebrow } from './kip-ui'
import { KipMark, KipWordmark } from './kip-logo'
import { FlowHeader } from './word-grid'

const variants = [
  { tone: 'gold', name: 'Gold', use: 'App icon, splash' },
  { tone: 'vault', name: 'Vault', use: 'Dark surfaces' },
  { tone: 'outline', name: 'Outline', use: 'In-app badges' },
] as const

const files = [
  { href: '/brand/kip-icon-1024.png', label: 'App icon', meta: 'PNG · 1024' },
  { href: '/brand/kip-adaptive-foreground.png', label: 'Android adaptive foreground', meta: 'PNG · 432' },
  { href: '/brand/kip-monochrome.png', label: 'Android monochrome', meta: 'PNG · 432' },
  { href: '/brand/kip-splash.png', label: 'Splash logo', meta: 'PNG · 512' },
  { href: '/brand/kip-icon.svg', label: 'Icon', meta: 'SVG' },
  { href: '/brand/kip-glyph.svg', label: 'Glyph only', meta: 'SVG' },
]

const colors = [
  { name: 'kip gold', hex: '#F3BA2F', swatch: 'bg-primary' },
  { name: 'Vault', hex: '#0B0F19', swatch: 'bg-background ring-1 ring-inset ring-border' },
]

export function BrandScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-safe">
      <FlowHeader title="kip logo" onBack={onBack} />

      <div className="flex flex-col gap-3">
        <section className="flex flex-col items-center gap-5 rounded-3xl bg-card px-5 pt-8 pb-6 text-center ring-1 ring-inset ring-border">
          <KipMark size={120} animated />
          <KipWordmark size={36} />
          <p className="max-w-64 text-sm leading-relaxed text-pretty text-muted-foreground">
            The stem is your phone. The chevron is theirs, leaning in. The gap is the second before the tap.
          </p>
        </section>

        <section aria-labelledby="variants-label" className="flex flex-col gap-3 rounded-3xl bg-card p-5 ring-1 ring-inset ring-border">
          <Eyebrow id="variants-label">Variants</Eyebrow>
          <ul className="grid grid-cols-3 gap-3">
            {variants.map((v) => (
              <li key={v.tone} className="flex flex-col items-center gap-2 text-center">
                <KipMark size={64} tone={v.tone} />
                <span className="text-sm font-semibold">{v.name}</span>
                <span className="text-xs leading-snug text-muted-foreground">{v.use}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="homescreen-label" className="flex flex-col gap-3 rounded-3xl bg-card p-5 ring-1 ring-inset ring-border">
          <Eyebrow id="homescreen-label">On the home screen</Eyebrow>
          <div className="grid grid-cols-4 gap-y-4 rounded-2xl bg-background px-2 py-5 ring-1 ring-inset ring-border">
            {['Phone', 'Camera', 'kip', 'Clock'].map((label) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                {label === 'kip' ? (
                  <KipMark size={52} className="!rounded-full" />
                ) : (
                  <span className="size-13 rounded-full bg-muted" aria-hidden="true" />
                )}
                <span className={label === 'kip' ? 'text-xs font-medium' : 'text-xs text-muted-foreground'}>{label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-end justify-between px-1 pt-1">
            {[48, 36, 24, 16].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <KipMark size={s} />
                <span className="font-mono text-xs text-muted-foreground">{s}px</span>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="colors-label" className="flex flex-col gap-3 rounded-3xl bg-card p-5 ring-1 ring-inset ring-border">
          <Eyebrow id="colors-label">Colors</Eyebrow>
          <ul className="grid grid-cols-2 gap-3">
            {colors.map((c) => (
              <li key={c.hex} className="flex items-center gap-3">
                <span className={`size-10 shrink-0 rounded-xl ${c.swatch}`} aria-hidden="true" />
                <span className="flex flex-col">
                  <span className="text-sm font-semibold">{c.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{c.hex}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="files-label" className="flex flex-col gap-1 rounded-3xl bg-card p-5 ring-1 ring-inset ring-border">
          <Eyebrow id="files-label" className="pb-2">
            Files for your app
          </Eyebrow>
          {files.map((f) => (
            <a
              key={f.href}
              href={f.href}
              download
              className="flex items-center justify-between gap-3 rounded-xl px-1 py-2.5 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span className="flex flex-col">
                <span className="text-sm font-medium">{f.label}</span>
                <span className="font-mono text-xs text-muted-foreground">{f.meta}</span>
              </span>
              <Download className="size-5 shrink-0 text-primary" aria-hidden="true" />
            </a>
          ))}
        </section>

        <a
          href="/brand"
          className="flex h-13 items-center justify-center rounded-2xl bg-muted text-[15px] font-semibold text-primary ring-1 ring-inset ring-border focus-visible:outline-2 focus-visible:outline-primary"
        >
          Open full brand book
        </a>
      </div>
    </div>
  )
}
