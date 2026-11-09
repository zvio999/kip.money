import { KipMark } from '@/components/wallet/kip-logo'
import { BookSection, Panel } from './section'

export function Cover() {
  return (
    <header className="flex flex-col gap-12 py-16 md:flex-row md:items-end md:justify-between">
      <div className="flex max-w-xl flex-col gap-6">
        <span className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
          kip brand book · version 1.0 · October 2026
        </span>
        <h1 className="text-5xl font-bold tracking-tight text-balance md:text-7xl">
          Tap. Paid. <span className="text-primary">Keys stay home.</span>
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-pretty text-muted-foreground">
          How kip looks, sounds, and moves. Use this book when you design a screen, write copy, or ship an asset.
        </p>
      </div>
      <KipMark size={200} animated className="self-start md:self-auto" />
    </header>
  )
}

const principles = [
  {
    title: 'Calm, not hype',
    body: 'Money moves fast in kip, but the interface never rushes. No confetti, no countdowns, no flashing prices.',
  },
  {
    title: 'Honest about risk',
    body: 'We say plainly what is permanent: a lost recovery phrase cannot be restored. Warnings are rare, so they get read.',
  },
  {
    title: 'The tap is the product',
    body: 'Everything leads to two phones touching. If a feature does not make that moment simpler, it waits.',
  },
]

export function IdeaSection() {
  return (
    <BookSection
      id="idea"
      label="Idea"
      title="A cold wallet that pays like cash."
      intro="kip keeps private keys in the phone's hardware vault and pays by tapping phones together. The brand has to feel as solid as a safe and as quick as handing someone a coin."
    >
      <ul className="grid gap-4 md:grid-cols-3">
        {principles.map((p) => (
          <li key={p.title}>
            <Panel className="flex h-full flex-col gap-3">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{p.body}</p>
            </Panel>
          </li>
        ))}
      </ul>
    </BookSection>
  )
}
