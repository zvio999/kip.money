import { Download } from 'lucide-react'
import { KipMark } from '@/components/wallet/kip-logo'
import { PrintButton } from './print-button'
import { BookSection, Panel, PanelCaption } from './section'

const files = [
  { href: '/brand/kip-icon-1024.png', label: 'App icon', meta: 'PNG · 1024 × 1024', use: 'Play Store, App Store' },
  { href: '/brand/kip-adaptive-foreground.png', label: 'Adaptive foreground', meta: 'PNG · 432 × 432', use: 'Android adaptive icon' },
  { href: '/brand/kip-monochrome.png', label: 'Monochrome', meta: 'PNG · 432 × 432', use: 'Android 13 themed icon' },
  { href: '/brand/kip-splash.png', label: 'Splash logo', meta: 'PNG · 512 × 512', use: 'Expo splash, on #0B0F19' },
  { href: '/brand/kip-icon.svg', label: 'Icon', meta: 'SVG', use: 'Web, print, source of truth' },
  { href: '/brand/kip-glyph.svg', label: 'Glyph only', meta: 'SVG', use: 'Notifications, in-app' },
]

export function AssetsSection() {
  return (
    <BookSection
      id="assets"
      label="Assets"
      title="Everything you need to ship."
      intro="Download the files below and drop them into your app's assets folder. Always use these exports instead of screenshots."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="flex flex-col gap-6 lg:col-span-1">
          <div className="flex items-center justify-center gap-6 rounded-2xl bg-background py-10">
            <KipMark size={88} className="!rounded-[22px]" />
            <KipMark size={88} className="!rounded-full" />
          </div>
          <PanelCaption title="App icon">
            iOS uses the rounded square; Android crops to its own shape. Background #0B0F19 for the adaptive layer.
          </PanelCaption>
        </Panel>
        <Panel className="flex flex-col p-2 lg:col-span-2">
          <ul className="flex flex-col divide-y divide-border">
            {files.map((f) => (
              <li key={f.href}>
                <a
                  href={f.href}
                  download
                  className="flex items-center justify-between gap-4 rounded-2xl px-4 py-4 transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold">{f.label}</span>
                    <span className="text-sm text-muted-foreground">{f.use}</span>
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="hidden font-mono text-xs text-muted-foreground sm:inline">{f.meta}</span>
                    <Download className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <PrintButton />
    </BookSection>
  )
}
