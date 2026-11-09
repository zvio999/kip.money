'use client'

import { useCallback, useState } from 'react'
import { BrandScreen } from './brand-screen'
import { DeviceFrame } from './device-frame'
import { HomeScreen } from './home-screen'
import { LockScreen } from './lock-screen'
import { CreateWalletScreen, ForgotPinScreen, ImportWalletScreen, WelcomeScreen } from './onboarding-screens'
import { ScreenIndex, type ScreenEntry } from './screen-index'
import { HistorySheet, MenuSheet, UpdateSheet, VaultKeySheet } from './sheets/menu-sheets'
import { GetSheet, PaySheet } from './sheets/tap-sheets'
import { AddTokenSheet, AssetSheet, ReceiveSheet, SendSheet } from './sheets/transfer-sheets'
import type { Screen, SheetState } from '@/lib/wallet-data'

export function WalletApp() {
  const [screen, setScreen] = useState<Screen>('lock')
  const [sheet, setSheet] = useState<SheetState>(null)
  const [hidden, setHidden] = useState(false)
  const [directSign, setDirectSign] = useState(true)

  const closeSheet = useCallback(() => setSheet(null), [])

  const select = (entry: ScreenEntry) => {
    setScreen(entry.screen)
    setSheet(entry.sheet ?? null)
  }

  return (
    <main className="flex min-h-dvh items-center justify-center gap-16 md:p-8">
      <ScreenIndex current={sheet ? sheet.name : screen} onSelect={select} />
      <DeviceFrame>
        <ScreenContent
          screen={screen}
          setScreen={setScreen}
          hidden={hidden}
          setHidden={setHidden}
          openSheet={setSheet}
        />
        {screen === 'home' && sheet && (
          <SheetHost
            key={sheet.name + ('token' in sheet ? sheet.token : '')}
            sheet={sheet}
            hidden={hidden}
            directSign={directSign}
            setDirectSign={setDirectSign}
            onClose={closeSheet}
            onOpen={setSheet}
            onWipe={() => {
              setSheet(null)
              setScreen('welcome')
            }}
          />
        )}
      </DeviceFrame>
    </main>
  )
}

function ScreenContent({
  screen,
  setScreen,
  hidden,
  setHidden,
  openSheet,
}: {
  screen: Screen
  setScreen: (s: Screen) => void
  hidden: boolean
  setHidden: (fn: (h: boolean) => boolean) => void
  openSheet: (s: SheetState) => void
}) {
  switch (screen) {
    case 'welcome':
      return <WelcomeScreen onCreate={() => setScreen('create')} onImport={() => setScreen('import')} />
    case 'create':
      return <CreateWalletScreen onBack={() => setScreen('welcome')} onDone={() => setScreen('lock')} />
    case 'import':
      return <ImportWalletScreen onBack={() => setScreen('welcome')} onDone={() => setScreen('lock')} />
    case 'lock':
      return <LockScreen onUnlock={() => setScreen('home')} onForgot={() => setScreen('forgot')} />
    case 'forgot':
      return <ForgotPinScreen onBack={() => setScreen('lock')} onDone={() => setScreen('lock')} />
    case 'brand':
      return <BrandScreen onBack={() => setScreen('home')} />
    case 'home':
      return (
        <HomeScreen
          hidden={hidden}
          onToggleHidden={() => setHidden((h) => !h)}
          onOpen={openSheet}
          onLock={() => setScreen('lock')}
        />
      )
  }
}

function SheetHost({
  sheet,
  hidden,
  directSign,
  setDirectSign,
  onClose,
  onOpen,
  onWipe,
}: {
  sheet: NonNullable<SheetState>
  hidden: boolean
  directSign: boolean
  setDirectSign: (v: boolean) => void
  onClose: () => void
  onOpen: (s: SheetState) => void
  onWipe: () => void
}) {
  switch (sheet.name) {
    case 'menu':
      return <MenuSheet directSign={directSign} onDirectSign={setDirectSign} onClose={onClose} onOpen={onOpen} />
    case 'asset':
      return <AssetSheet symbol={sheet.token} hidden={hidden} onClose={onClose} onOpen={onOpen} />
    case 'pay':
      return <PaySheet directSign={directSign} onClose={onClose} />
    case 'get':
      return <GetSheet onClose={onClose} />
    case 'send':
      return <SendSheet initialToken={sheet.token} directSign={directSign} onClose={onClose} />
    case 'receive':
      return <ReceiveSheet initialToken={sheet.token} onClose={onClose} />
    case 'history':
      return <HistorySheet hidden={hidden} onClose={onClose} />
    case 'vault':
      return <VaultKeySheet onClose={onClose} onOpen={onOpen} onWipe={onWipe} />
    case 'update':
      return <UpdateSheet onClose={onClose} />
    case 'token':
      return <AddTokenSheet onClose={onClose} />
  }
}
