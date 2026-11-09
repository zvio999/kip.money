'use client'

import { Printer } from 'lucide-react'
import { KipButton } from '@/components/wallet/kip-ui'

export function PrintButton() {
  return (
    <KipButton variant="secondary" className="w-full sm:w-fit sm:px-6 print:hidden" onClick={() => window.print()}>
      <Printer className="size-5" aria-hidden="true" />
      Save brand book as PDF
    </KipButton>
  )
}
