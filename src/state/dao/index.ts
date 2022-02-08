import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import daoConfig from 'config/constants/dao'
import fetchDaos from './fetchDaos'
import fetchUserDaos from './fetchUserDaos'
import { DaoState, Dao } from '../types'

const noAccountFarmConfig = daoConfig.map((dao) => ({
  ...dao,
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

      return farms
    }
  ,
  )

export const fetchDaoUserDataAsync =
  createAsyncThunk<Dao[], { account: string; pids: number[] }>(
    'dao/fetchDaoUserDataAsync',
    async ({ account, pids }) => {
      const daoToFetch = daoConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
      const userDaoAllowances = await fetchUserDaos(account, daoToFetch)
      return userDaoAllowances

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
      state.data = state.data.map((dao) => {
        const liveFarmData = action.payload.find((farmData) => farmData.pid === dao.pid)
        return { ...dao, ...liveFarmData }
      })
    })

  },
})

// Actions
export const { setLoadArchivedFarmsData } = daoSlice.actions

export default daoSlice.reducer
