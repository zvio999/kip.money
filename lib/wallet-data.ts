export type TokenSymbol = 'BNB' | 'USDT' | 'USDC' | 'FDUSD'

export type Token = {
  symbol: TokenSymbol
  name: string
  kind: 'Native gas' | 'BEP-20'
  balance: number
  usdPrice: number
  contract?: string
  color: string
  ink: string
}

export type Tx = {
  id: string
  token: TokenSymbol
  type: 'received' | 'sent'
  amount: number
  counterparty: string
  via: 'Tap' | 'Address'
  date: string
}

export type Screen = 'welcome' | 'create' | 'import' | 'lock' | 'forgot' | 'home' | 'brand'

export type SheetState =
  | { name: 'menu' }
  | { name: 'asset'; token: TokenSymbol }
  | { name: 'pay' }
  | { name: 'get' }
  | { name: 'send'; token: TokenSymbol }
  | { name: 'receive'; token: TokenSymbol }
  | { name: 'history' }
  | { name: 'vault' }
  | { name: 'update' }
  | { name: 'token' }
  | null

export const VAULT_ADDRESS = '0xeDED244a15272012262a4aE4Ab482Abe0CaC3fda'
export const APP_VERSION = '1.0.0'

export const TOKENS: Token[] = [
  { symbol: 'BNB', name: 'BNB', kind: 'Native gas', balance: 0.000136, usdPrice: 735, color: '#F3BA2F', ink: '#0B0F19' },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    kind: 'BEP-20',
    balance: 1.2,
    usdPrice: 1,
    contract: '0x55d398326f99059fF775485246999027B3197955',
    color: '#26A17B',
    ink: '#0B0F19',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    kind: 'BEP-20',
    balance: 0,
    usdPrice: 1,
    contract: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    color: '#2775CA',
    ink: '#F3F4F6',
  },
  {
    symbol: 'FDUSD',
    name: 'First Digital USD',
    kind: 'BEP-20',
    balance: 0,
    usdPrice: 1,
    contract: '0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409',
    color: '#00B386',
    ink: '#0B0F19',
  },
]

export const TRANSACTIONS: Tx[] = [
  { id: 't1', token: 'USDT', type: 'received', amount: 1.2, counterparty: '0x91fA0c27Bd43e1a9', via: 'Tap', date: 'Oct 23, 21:14' },
  { id: 't2', token: 'BNB', type: 'received', amount: 0.0002, counterparty: '0x3C4e8aB1f0D2c771', via: 'Address', date: 'Oct 21, 09:02' },
  { id: 't3', token: 'BNB', type: 'sent', amount: 0.000064, counterparty: '0x7Ad1E90b2C5f4e18', via: 'Tap', date: 'Oct 20, 18:47' },
]

export const SAMPLE_PHRASE = [
  'orbit',
  'velvet',
  'harbor',
  'cinder',
  'maple',
  'quarry',
  'lantern',
  'oxygen',
  'tundra',
  'saddle',
  'pepper',
  'ribbon',
]

export function getToken(symbol: TokenSymbol) {
  return TOKENS.find((t) => t.symbol === symbol)!
}

export function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function formatUsd(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
}

export function formatAmount(value: number) {
  if (value === 0) return '0'
  return value.toLocaleString('en-US', { maximumFractionDigits: 6 })
}

export const totalUsd = TOKENS.reduce((sum, t) => sum + t.balance * t.usdPrice, 0)

export const isAddress = (value: string) => /^0x[a-fA-F0-9]{40}$/.test(value.trim())
