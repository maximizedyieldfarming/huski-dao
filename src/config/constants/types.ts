import BigNumber from 'bignumber.js'
import { SerializedBigNumber, TranslatableText } from 'state/types'

export interface Address {
  97?: string
  56?: string
}

export interface Token {
  symbol: string
  poolId?: number
  debtPoolId?: number
  address?: Address
  config?: Address
  decimals?: number
  decimalsDigits?: number
  projectLink?: string
  busdPrice?: string
  coingeckoId?: string
}


export interface DaoConfig {
  pid: number
  name: string
  vaultAddress: Address
  token: Token
}

export type Images = {
  lg: string
  md: string
  sm: string
  ipfs?: string
}

export type CampaignType = 'ifo' | 'teambattle' | 'participation'

export type Campaign = {
  id: string
  type: CampaignType
  title?: TranslatableText
  description?: TranslatableText
  badge?: string
}

export type PageMeta = {
  title: string
  description?: string
  image?: string
}

export enum LotteryStatus {
  PENDING = 'pending',
  OPEN = 'open',
  CLOSE = 'close',
  CLAIMABLE = 'claimable',
}

