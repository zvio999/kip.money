import { BatteryFull, ChevronLeft, Signal, Wifi } from 'lucide-react'

export function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full md:w-auto md:rounded-[3.25rem] md:bg-card md:p-3 md:shadow-2xl md:ring-1 md:ring-border">
      <div className="flex h-dvh w-full flex-col overflow-hidden bg-background md:h-[844px] md:w-[390px] md:rounded-[2.6rem]">
        <div
          className="hidden h-11 shrink-0 items-center justify-between px-7 text-sm font-semibold md:flex"
          aria-hidden="true"
        >
          <span>1:36</span>
          <span className="flex items-center gap-1.5">
            <Signal className="size-4" />
            <Wifi className="size-4" />
            <BatteryFull className="size-5" />
          </span>
        </div>
        <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
        <div
          className="hidden h-12 shrink-0 items-center justify-around bg-background px-12 text-muted-foreground md:flex"
          aria-hidden="true"
        >
          <span className="flex gap-1">
            <span className="h-4 w-0.5 rounded-full bg-current" />
            <span className="h-4 w-0.5 rounded-full bg-current" />
            <span className="h-4 w-0.5 rounded-full bg-current" />
          </span>
          <span className="size-4 rounded-md ring-2 ring-current" />
          <ChevronLeft className="size-5" />
        </div>
      </div>
    </div>
  )
}
