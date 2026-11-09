import { KipWordmark } from './kip-logo'
import { cn } from '@/lib/utils'
import type { Screen, SheetState } from '@/lib/wallet-data'

export type ScreenEntry = { id: string; label: string; screen: Screen; sheet?: SheetState }

const groups: { title: string; entries: ScreenEntry[] }[] = [
  {
    title: 'Wallet',
    entries: [
      { id: 'home', label: 'Home', screen: 'home' },
      { id: 'menu', label: 'Menu sheet', screen: 'home', sheet: { name: 'menu' } },
      { id: 'asset', label: 'Asset sheet', screen: 'home', sheet: { name: 'asset', token: 'USDT' } },
      { id: 'history', label: 'History', screen: 'home', sheet: { name: 'history' } },
    ],
  },
  {
    title: 'Phone tap',
    entries: [
      { id: 'pay', label: 'Pay', screen: 'home', sheet: { name: 'pay' } },
      { id: 'get', label: 'Get', screen: 'home', sheet: { name: 'get' } },
    ],
  },
  {
    title: 'Transfer',
    entries: [
      { id: 'send', label: 'Send', screen: 'home', sheet: { name: 'send', token: 'USDT' } },
      { id: 'receive', label: 'Receive', screen: 'home', sheet: { name: 'receive', token: 'USDT' } },
      { id: 'token', label: 'Add token', screen: 'home', sheet: { name: 'token' } },
    ],
  },
  {
    title: 'Security',
    entries: [
      { id: 'lock', label: 'Lock', screen: 'lock' },
      { id: 'forgot', label: 'Forgot PIN', screen: 'forgot' },
      { id: 'vault', label: 'Vault key', screen: 'home', sheet: { name: 'vault' } },
      { id: 'update', label: 'Wallet update', screen: 'home', sheet: { name: 'update' } },
    ],
  },
  {
    title: 'Setup',
    entries: [
      { id: 'welcome', label: 'Welcome', screen: 'welcome' },
      { id: 'create', label: 'Create wallet', screen: 'create' },
      { id: 'import', label: 'Import wallet', screen: 'import' },
    ],
  },
  {
    title: 'Brand',
    entries: [{ id: 'brand', label: 'Logo', screen: 'brand' }],
  },
]

export function ScreenIndex({ current, onSelect }: { current: string; onSelect: (entry: ScreenEntry) => void }) {
  return (
    <nav aria-label="Design screens" className="hidden w-48 flex-col gap-6 lg:flex">
      <div className="flex flex-col gap-2">
        <KipWordmark size={32} />
        <span className="font-mono text-xs text-muted-foreground">{'Screens · 390 × 844'}</span>
      </div>
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-1">
          <span className="pb-1 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {group.title}
          </span>
          {group.entries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSelect(entry)}
              aria-current={current === entry.id ? 'page' : undefined}
              className={cn(
                'rounded-lg px-3 py-1.5 text-left text-sm transition-colors',
                current === entry.id ? 'bg-primary font-semibold text-primary-foreground' : 'text-foreground hover:bg-card',
              )}
            >
              {entry.label}
            </button>
          ))}
          {group.title === 'Brand' && (
            <a
              href="/brand"
              className="rounded-lg px-3 py-1.5 text-left text-sm text-primary transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-primary"
            >
              Brand book ↗
            </a>
          )}
        </div>
      ))}
    </nav>
  )
}
