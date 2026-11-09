'use client'

import { TapAnimation, useTapLoop } from '@/components/wallet/tap-animation'

export function TapDemo() {
  const phase = useTapLoop()
  return <TapAnimation phase={phase} />
}
