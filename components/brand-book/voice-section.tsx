import { BookSection, Panel, Rule } from './section'

const pairs = [
  {
    context: 'Pay sheet',
    yes: 'Hold this phone against the receiver. Payment sends on tap.',
    no: 'Initiate NFC handshake to broadcast your signed BEP-20 transaction!',
  },
  {
    context: 'Recovery phrase',
    yes: 'Write these 12 words on paper. Anyone with them can take your money.',
    no: 'Please securely back up your mnemonic seed for optimal safety.',
  },
  {
    context: 'Payment received',
    yes: 'Received 1.20 USDT from 0x91fA…7955.',
    no: 'Woohoo!! Money incoming, you are crushing it!',
  },
  {
    context: 'Wipe wallet',
    yes: 'This removes kip from this phone. Without your 12 words, the funds are gone.',
    no: 'Are you sure? This action may have consequences.',
  },
]

const rules = [
  'Sentence case everywhere. “Send BEP-20”, not “Send Bep-20 Tokens”.',
  'Lowercase “kip” in running text, even at the start of a sentence.',
  'Say what happens, then what to do. Two short sentences beat one long one.',
  'Name the risk plainly. No “may”, no “potentially”.',
  'No exclamation marks, no emoji, no crypto slang.',
]

export function VoiceSection() {
  return (
    <BookSection
      id="voice"
      label="Voice"
      title="A calm friend who knows security."
      intro="kip talks like someone handing you a key: short, clear, and serious only when it matters."
    >
      <ul className="flex flex-col gap-4">
        {pairs.map((p) => (
          <li key={p.context}>
            <Panel className="grid gap-5 md:grid-cols-[10rem_1fr_1fr] md:items-start">
              <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase">{p.context}</span>
              <div className="flex flex-col gap-2">
                <Rule kind="do">Write</Rule>
                <p className="text-[15px] leading-relaxed">{p.yes}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Rule kind="dont">Avoid</Rule>
                <p className="text-[15px] leading-relaxed text-muted-foreground line-through decoration-destructive/60">
                  {p.no}
                </p>
              </div>
            </Panel>
          </li>
        ))}
      </ul>
      <Panel>
        <ul className="grid gap-x-10 gap-y-3 md:grid-cols-2">
          {rules.map((r) => (
            <li key={r} className="flex gap-3 text-sm leading-relaxed">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              {r}
            </li>
          ))}
        </ul>
      </Panel>
    </BookSection>
  )
}
