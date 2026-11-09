import { KipMark } from '@/components/wallet/kip-logo'
import { BookSection, Panel, PanelCaption } from './section'
import { TapDemo } from './tap-demo'

const timings = [
  { name: 'Knock', value: '2.4 s loop', note: 'Logo chevron leans 5 units in, holds, returns.' },
  { name: 'Ripple', value: '1.2 s', note: 'NFC pulse from the contact point when phones connect.' },
  { name: 'Sheet', value: '240 ms', note: 'Bottom sheets slide up with ease-out.' },
  { name: 'Press', value: '98% scale', note: 'Buttons dip slightly on press. No bounce.' },
]

export function MotionSection() {
  return (
    <BookSection
      id="motion"
      label="Motion"
      title="Everything moves like the tap."
      intro="Motion has one job: show the user what is happening between two phones. It closes the gap, then rests."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="flex flex-col gap-6">
          <div className="flex h-64 items-center justify-center rounded-2xl bg-background">
            <KipMark size={140} animated />
          </div>
          <PanelCaption title="The knock">
            The only time the gap closes. Use for splash, loading, and waiting for a tap — never as decoration.
          </PanelCaption>
        </Panel>
        <Panel className="flex flex-col gap-6">
          <div className="flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-background">
            <TapDemo />
          </div>
          <PanelCaption title="Tap to pay">
            Phones approach, touch, pulse, and confirm. The same easing as the knock, at phone scale.
          </PanelCaption>
        </Panel>
      </div>
      <Panel className="p-0">
        <dl className="grid divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
          {timings.map((t) => (
            <div key={t.name} className="flex flex-col gap-1 p-6">
              <dt className="text-sm font-semibold">{t.name}</dt>
              <dd className="font-mono text-lg text-primary">{t.value}</dd>
              <dd className="text-sm leading-relaxed text-muted-foreground">{t.note}</dd>
            </div>
          ))}
        </dl>
      </Panel>
      <p className="text-sm text-muted-foreground">
        All loops stop when the system asks for reduced motion. The status text still tells the user what is happening.
      </p>
    </BookSection>
  )
}
