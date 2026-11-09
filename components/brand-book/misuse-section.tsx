import { KIP_CHEVRON, KIP_STEM, KipMark } from '@/components/wallet/kip-logo'
import { BookSection, Panel, Rule } from './section'

function ClosedGapMark() {
  return (
    <span className="inline-flex size-20 items-center justify-center rounded-[20px] bg-primary text-primary-foreground">
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="size-full">
        <rect {...KIP_STEM} fill="currentColor" />
        <path
          d={KIP_CHEVRON}
          transform="translate(-6 0)"
          stroke="currentColor"
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

const misuses: { label: string; sample: React.ReactNode }[] = [
  { label: 'Do not stretch or squash', sample: <KipMark size={80} className="scale-x-[1.4]" /> },
  { label: 'Do not rotate', sample: <KipMark size={80} className="rotate-[18deg]" /> },
  { label: 'Do not recolor', sample: <KipMark size={80} className="!bg-success" /> },
  { label: 'Do not close the gap', sample: <ClosedGapMark /> },
  { label: 'Do not add glows or shadows', sample: <KipMark size={80} className="shadow-[0_0_40px_var(--primary)]" /> },
  { label: 'Do not use a circle container', sample: <KipMark size={80} className="!rounded-full" /> },
]

export function MisuseSection() {
  return (
    <BookSection
      id="misuse"
      label="Logo misuse"
      title="Leave the mark alone."
      intro="The only exception: Android may crop the icon to a circle on the home screen. That is the system, not us."
    >
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {misuses.map((m) => (
          <li key={m.label}>
            <Panel className="flex h-full flex-col gap-5">
              <div className="flex h-36 items-center justify-center rounded-2xl bg-background" aria-hidden="true">
                {m.sample}
              </div>
              <div className="flex flex-col gap-2">
                <Rule kind="dont">Don&apos;t</Rule>
                <span className="text-sm font-medium">{m.label}</span>
              </div>
            </Panel>
          </li>
        ))}
      </ul>
    </BookSection>
  )
}
