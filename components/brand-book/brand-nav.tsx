import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { KipWordmark } from '@/components/wallet/kip-logo'

export const CHAPTERS = [
  { id: 'idea', label: 'Idea' },
  { id: 'logo', label: 'Logo' },
  { id: 'misuse', label: 'Logo misuse' },
  { id: 'color', label: 'Color' },
  { id: 'type', label: 'Typography' },
  { id: 'voice', label: 'Voice' },
  { id: 'components', label: 'Components' },
  { id: 'motion', label: 'Motion' },
  { id: 'assets', label: 'Assets' },
]

export function BrandNav() {
  return (
    <nav
      aria-label="Brand book chapters"
      className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col justify-between border-r border-border px-8 py-10 lg:flex print:hidden"
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <KipWordmark size={30} />
          <span className="font-mono text-xs text-muted-foreground">Brand book · v1.0</span>
        </div>
        <ul className="flex flex-col gap-1">
          {CHAPTERS.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                className="block rounded-lg px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-primary"
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-medium text-primary focus-visible:outline-2 focus-visible:outline-primary"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to app screens
      </Link>
    </nav>
  )
}
