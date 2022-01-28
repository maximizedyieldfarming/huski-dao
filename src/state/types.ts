import { ThunkAction } from 'redux-thunk'
import { AnyAction } from '@reduxjs/toolkit'

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, AnyAction>

export interface BigNumberToJson {
  type: 'BigNumber'
  hex: string
}

export type SerializedBigNumber = string


export interface Profile {
  userId: number
  points: number
  teamId: number
  nftAddress: string
  tokenId: number
  isActive: boolean
  username: string
  // nft?: Nft
  // team?: Team
  hasRegistered: boolean
}

// Slices states
export interface ProfileState {
  isInitialized: boolean
  isLoading: boolean
  hasRegistered: boolean
  data: Profile
}
export interface BlockState {
  currentBlock: number
  initialBlock: number
}


// Global state

export interface State {
  block: BlockState
  profile: ProfileState
}
