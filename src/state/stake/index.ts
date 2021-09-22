import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import stakeConfig from 'config/constants/stake'
import isArchivedPid from 'utils/farmHelpers'
import fetchStakes from './fetchStake'
import fetchFarmsPrices from './fetchStakePrices'
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from './fetchStakeUser'
import { StakeState, Stake } from '../types'

const noAccountFarmConfig = stakeConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
  },
}))

const initialState: StakeState = { data: noAccountFarmConfig, loadArchivedFarmsData: false, userDataLoaded: false }

export const nonArchivedFarms = stakeConfig.filter(({ pid }) => !isArchivedPid(pid))

// Async thunks
export const fetchStakePublicDataAsync = 
createAsyncThunk<Stake[], number[]>(
  'stake/fetchStakePublicDataAsync',
  async (pids) => {
    const farmsToFetch = stakeConfig.filter((farmConfig) => pids.includes(farmConfig.pid))

    const farms = await fetchStakes(farmsToFetch)
    const farmsWithPrices = await fetchFarmsPrices(farms)

    // Filter out price helper LP config farms
    const farmsWithoutHelperLps = farmsWithPrices.filter((farm: Stake) => {
      return farm.pid || farm.pid === 0
    })
    return farmsWithoutHelperLps

  }
  ,
)

interface StakeUserDataResponse {
  pid: number
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
}

export const fetchStakeUserDataAsync = 
createAsyncThunk<StakeUserDataResponse[], { account: string; pids: number[] }>(
  'stake/fetchStakeUserDataAsync',
  async ({ account, pids }) => {
    const farmsToFetch = stakeConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
    const userFarmAllowances = await fetchFarmUserAllowances(account, farmsToFetch)
    const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsToFetch)
    const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsToFetch)
    const userFarmEarnings = await fetchFarmUserEarnings(account, farmsToFetch)

    // console.log("stake: ", "fetchStakeUserDataAsync")
    return userFarmAllowances.map((farmAllowance, index) => {
      return {
        pid: farmsToFetch[index].pid,
        allowance: userFarmAllowances[index],
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: userFarmEarnings[index],
      }
    })
  }
  ,
)

export const stakeSlice = createSlice({
  name: 'stake',
  initialState,
  reducers: {
    setLoadArchivedFarmsData: (state, action) => {
      const loadArchivedFarmsData = action.payload
      state.loadArchivedFarmsData = loadArchivedFarmsData
    },
  },
  extraReducers: (builder) => {
    // Update farms with live data
    builder.addCase(fetchStakePublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((farm) => {
        const liveFarmData = action.payload.find((farmData) => farmData.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    })

    // Update farms with user data
    builder.addCase(fetchStakeUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { pid } = userDataEl
        const index = state.data.findIndex((farm) => farm.pid === pid)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    })
  },
})

// Actions
export const { setLoadArchivedFarmsData } = stakeSlice.actions

export default stakeSlice.reducer
