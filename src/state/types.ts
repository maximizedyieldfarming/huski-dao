import { ThunkAction } from 'redux-thunk'
import { AnyAction } from '@reduxjs/toolkit'
import { DaoConfig } from 'config/constants/types'

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, AnyAction>

export interface BigNumberToJson {
  type: 'BigNumber'
  hex: string
}

export type SerializedBigNumber = string


// Slices states

export interface BlockState {
  currentBlock: number
  initialBlock: number
}

// dao

export interface Dao extends DaoConfig {
  pid: number
  name: string
  userData?: {
    allowance: string
  }
  code?: SerializedBigNumber
  price?: string
  roundID?: string
  startedAt?: string
  timeStamp?: string
  answeredInRound?: string
}

export interface DaoState {
  data: Dao[]
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
  tradingDataLoaded: boolean
}

// Global state

export interface State {
  block: BlockState
  dao: DaoState
}
