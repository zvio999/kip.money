import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatAmount, getToken, shortAddress, type Token, type Tx } from '@/lib/wallet-data'

const buttonVariants = {
  primary: 'h-13 bg-primary text-primary-foreground',
  secondary: 'h-13 bg-muted text-primary ring-1 ring-inset ring-border',
  danger: 'h-13 bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/50',
  ghost: 'h-11 text-primary',
}

export function KipButton({
  variant = 'primary',
  className,
  ...props
}: React.ComponentProps<'button'> & { variant?: keyof typeof buttonVariants }) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold transition-[transform,opacity] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100',
        buttonVariants[variant],
        className,
      )}
      {...props}
    />
  )
}

export function Chip({ active, className, ...props }: React.ComponentProps<'button'> & { active: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'h-10 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        active ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground ring-1 ring-inset ring-border',
        className,
      )}
      {...props}
    />
  )
}

export function FieldLabel({ className, ...props }: React.ComponentProps<'label'>) {
  return <label className={cn('text-sm font-medium text-foreground', className)} {...props} />
}

export function KipInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-13 w-full rounded-2xl bg-background px-4 text-[15px] text-foreground ring-1 ring-inset ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary',
        className,
      )}
      {...props}
    />
  )
}

export function Eyebrow({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn('text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase', className)}
      {...props}
    />
  )
}

export function InfoBox({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'rounded-2xl bg-background px-4 py-3.5 text-sm leading-relaxed text-pretty text-muted-foreground ring-1 ring-inset ring-border',
        className,
      )}
      {...props}
    />
  )
}

export function TokenBadge({ token, size = 'md' }: { token: Token; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-bold tracking-tight',
        size === 'sm' && 'size-9 text-[10px]',
        size === 'md' && 'size-12 text-xs',
        size === 'lg' && 'size-14 text-sm',
      )}
      style={{ backgroundColor: token.color, color: token.ink }}
    >
      {token.symbol.slice(0, 4)}
    </span>
  )
}

export function masked(hidden: boolean, value: string) {
  return hidden ? '••••' : value
}

export function TxRow({ tx, hidden }: { tx: Tx; hidden: boolean }) {
  const received = tx.type === 'received'
  const Icon = received ? ArrowDownLeft : ArrowUpRight
  return (
    <li className="flex items-center gap-3 py-3">
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full',
          received ? 'bg-success/12 text-success' : 'bg-destructive/12 text-destructive',
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[15px] font-semibold">
          {received ? 'Received' : 'Sent'} {tx.token}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {received ? 'From' : 'To'} <span className="font-mono">{shortAddress(tx.counterparty)}</span> · {tx.via} ·{' '}
          {tx.date}
        </span>
      </span>
      <span
        className={cn('font-mono text-sm font-semibold tabular-nums', received ? 'text-success' : 'text-destructive')}
      >
        {masked(hidden, `${received ? '+' : '−'}${formatAmount(tx.amount)}`)}
      </span>
    </li>
  )
}

export function TxList({ txs, hidden, empty }: { txs: Tx[]; hidden: boolean; empty: string }) {
  if (txs.length === 0) {
    return <p className="py-4 text-sm text-muted-foreground">{empty}</p>
  }
  return (
    <ul className="flex flex-col divide-y divide-border">
      {txs.map((tx) => (
        <TxRow key={tx.id} tx={tx} hidden={hidden} />
      ))}
    </ul>
  )
}

export function TokenChips({
  value,
  onChange,
  label = 'Token',
}: {
  value: Token['symbol']
  onChange: (symbol: Token['symbol']) => void
  label?: string
}) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-2.5 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {(['BNB', 'USDT', 'USDC', 'FDUSD'] as const).map((symbol) => (
          <Chip key={symbol} active={value === symbol} onClick={() => onChange(symbol)}>
            {getToken(symbol).symbol}
          </Chip>
        ))}
      </div>
    </fieldset>
  )
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        checked ? 'bg-success' : 'bg-muted',
      )}
    >
      <span
        className={cn(
          'absolute top-1 left-1 size-5 rounded-full bg-foreground transition-transform',
          checked && 'translate-x-5',
        )}
      />
    </button>
  )
}
