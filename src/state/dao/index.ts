import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import daoConfig from 'config/constants/dao'
import fetchDaos from './fetchDaos'

import {
  fetchFarmUserAllowances,

} from './fetchDaoUser'
import { DaoState, Dao } from '../types'


const noAccountFarmConfig = daoConfig.map((dao) => ({
  ...dao,
  userData: {
    allowance: '1',

  }
}))

const initialState: DaoState = { data: noAccountFarmConfig, loadArchivedFarmsData: false, userDataLoaded: false, tradingDataLoaded: false }
export const nonArchivedFarms = daoConfig // .filter(({ pid }) => !isArchivedPid(pid))
// Async thunks
export const fetchDaoPublicDataAsync =
  createAsyncThunk<Dao[], number[]>(
    'dao/fetchDaoPublicDataAsync',
    async (pids) => {
      const daoToFetch = daoConfig.filter((farmConfig) => pids.includes(farmConfig.pid))

      const farms = await fetchDaos(daoToFetch)
      // Filter out price helper LP config farms
      const farmsWithoutHelperLps = farms.filter((dao: Dao) => {
        return dao.pid || dao.pid === 0
      })
      return farmsWithoutHelperLps
    }
  ,
  )

interface DaoUserDataResponse {
  pid: number
  allowance: string

}

export const fetchDaoUserDataAsync =
  createAsyncThunk<DaoUserDataResponse[], { account: string; pids: number[] }>(
    'dao/fetchDaoUserDataAsync',
    async ({ account, pids }) => {
      const daoToFetch = daoConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
      // const userFarmAllowances = await fetchFarmUserAllowances(account, daoToFetch)


      return daoToFetch.map((farmAllowance, index) => {
        return {
          pid: daoToFetch[index].pid,
          allowance: '0',

        }
      })
    }
  ,
  )

export const daoSlice = createSlice({
  name: 'dao',
  initialState,
  reducers: {
    setLoadArchivedFarmsData: (state, action) => {
      const loadArchivedFarmsData = action.payload
      state.loadArchivedFarmsData = loadArchivedFarmsData
    },
  },
  extraReducers: (builder) => {
    // Update farms with live data
    builder.addCase(fetchDaoPublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((dao) => {
        const liveFarmData = action.payload.find((farmData) => farmData.pid === dao.pid)
        return { ...dao, ...liveFarmData }
      })
    })

    // Update farms with user data
    builder.addCase(fetchDaoUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { pid } = userDataEl
        const index = state.data.findIndex((dao) => dao.pid === pid)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    })


  },
})

// Actions
export const { setLoadArchivedFarmsData } = daoSlice.actions

export default daoSlice.reducer
