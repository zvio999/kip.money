import type { Metadata } from 'next'
import { AssetsSection } from '@/components/brand-book/assets-section'
import { BrandNav } from '@/components/brand-book/brand-nav'
import { ColorSection } from '@/components/brand-book/color-section'
import { ComponentsSection } from '@/components/brand-book/components-section'
import { Cover, IdeaSection } from '@/components/brand-book/cover'
import { LogoSection } from '@/components/brand-book/logo-section'
import { MisuseSection } from '@/components/brand-book/misuse-section'
import { MotionSection } from '@/components/brand-book/motion-section'
import { TypeSection } from '@/components/brand-book/type-section'
import { VoiceSection } from '@/components/brand-book/voice-section'

export const metadata: Metadata = {
  title: 'kip — Brand book',
  description: 'Logo, color, typography, voice, components, and motion guidelines for the kip cold wallet.',
}

export default function BrandBookPage() {
  return (
    <div className="flex min-h-dvh">
      <BrandNav />
      <main className="min-w-0 flex-1 px-6 md:px-12 xl:px-20">
        <div className="mx-auto max-w-5xl">
          <Cover />
          <IdeaSection />
          <LogoSection />
          <MisuseSection />
          <ColorSection />
          <TypeSection />
          <VoiceSection />
          <ComponentsSection />
          <MotionSection />
          <AssetsSection />
          <footer className="flex items-center justify-between border-t border-border py-10 font-mono text-xs text-muted-foreground">
            <span>kip brand book v1.0</span>
            <span>Questions? Ask before you improvise.</span>
          </footer>
        </div>
      </main>
    </div>
  )
}
