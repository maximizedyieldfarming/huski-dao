import { createSlice } from '@reduxjs/toolkit'
import farmsConfig from 'config/constants/leverage'
import isArchivedPid from 'utils/farmHelpers'
import { LeverageFarmsState } from '../types'

const noAccountFarmConfig = farmsConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
  },
}))

const initialState: LeverageFarmsState = { data: noAccountFarmConfig, loadArchivedFarmsData: false, userDataLoaded: false }

export const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))

export const lendSlice = createSlice({
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
export const { setLoadArchivedFarmsData } = lendSlice.actions

export default lendSlice.reducer
