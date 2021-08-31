import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import farmsConfig from 'config/constants/farms'
import isArchivedPid from 'utils/farmHelpers'
import priceHelperLpsConfig from 'config/constants/priceHelperLps'
// import fetchFarms from './fetchFarms'
// import fetchFarmsPrices from './fetchFarmsPrices'
// import {
//   fetchFarmUserEarnings,
//   fetchFarmUserAllowances,
//   fetchFarmUserTokenBalances,
//   fetchFarmUserStakedBalances,
// } from './fetchFarmUser'
import { FarmsState, Farm } from '../types'

const noAccountFarmConfig = farmsConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
  },
}))

const initialState: FarmsState = { data: noAccountFarmConfig, loadArchivedFarmsData: false, userDataLoaded: false }

export const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))



interface FarmUserDataResponse {
  pid: number
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
}


export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {
    setLoadArchivedFarmsData: (state, action) => {
      const loadArchivedFarmsData = action.payload
      state.loadArchivedFarmsData = loadArchivedFarmsData
    },
  },

})

// Actions
export const { setLoadArchivedFarmsData } = farmsSlice.actions

export default farmsSlice.reducer
