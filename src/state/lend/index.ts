import { createSlice } from '@reduxjs/toolkit'
import farmsConfig from 'config/constants/farms'
import isArchivedPid from 'utils/farmHelpers'
import { FarmsState } from '../types'

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
