import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import leverageFarmsConfig from 'config/constants/leverage'
import isArchivedPid from 'utils/farmHelpers'
import fetchFarms from './fetchFarms'
import fetchFarmsPrices from './fetchFarmsPrices'
import fetchFarmsTradeFees from './fetchFarmsTradeFees'
import {
  fetchFarmlpUserEarnings,
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenAllowances,
  fetchFarmUserQuoteTokenAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserTokenBalancesIB,
  fetchFarmUserQuoteTokenBalances,
  fetchFarmUserStakedBalances,
} from './fetchFarmUser'
import { LeverageFarmsState, LeverageFarm } from '../types'

const noAccountFarmConfig = leverageFarmsConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
  },
}))

const initialState: LeverageFarmsState = { data: noAccountFarmConfig, loadArchivedFarmsData: false, userDataLoaded: false }

export const nonArchivedFarms = leverageFarmsConfig.filter(({ pid }) => !isArchivedPid(pid))

// Async thunks
export const fetchLeverageFarmsPublicDataAsync =
  createAsyncThunk<LeverageFarm[], number[]>(
    'leverage/fetchLeverageFarmsPublicDataAsync',
    async (pids) => {
      const farmsToFetch = leverageFarmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))

      const farms = await fetchFarms(farmsToFetch)
      const farmsWithPrices = await fetchFarmsPrices(farms)
      const farmsWithPricesAndTradeFee = await fetchFarmsTradeFees(farmsWithPrices)
      // Filter out price helper LP config farms
      const farmsWithoutHelperLps = farmsWithPricesAndTradeFee.filter((farm: LeverageFarm) => {
        return farm.pid || farm.pid === 0
      })
      return farmsWithoutHelperLps
    }
  ,
  )

interface LeverageFarmUserDataResponse {
  pid: number
  allowance: string
  quoteTokenAllowance: string
  tokenBalance: string
  stakedBalance: string
  quoteTokenBalance: string
  tokenBalanceIB: string
  earnings: string
  farmEarnings: string
}

export const fetchLeverageFarmUserDataAsync =
  createAsyncThunk<LeverageFarmUserDataResponse[], { account: string; pids: number[] }>(
    'leverage/fetchLeverageFarmUserDataAsync',
    async ({ account, pids }) => {
      const farmsToFetch = leverageFarmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
      const userFarmAllowances = await fetchFarmUserAllowances(account, farmsToFetch)
      const userFarmTokenAllowances = await fetchFarmUserTokenAllowances(account, farmsToFetch)
      const userFarmLPAllowances = await fetchFarmUserQuoteTokenAllowances(account, farmsToFetch)
      const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsToFetch)
      const userFarmTokenBalancesIB = await fetchFarmUserTokenBalancesIB(account, farmsToFetch)
      const userFarmQuoteTokenBalances = await fetchFarmUserQuoteTokenBalances(account, farmsToFetch)
      const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsToFetch)
      const userFarmEarnings = await fetchFarmUserEarnings(account, farmsToFetch)
      const userFarmlpEarnings = await fetchFarmlpUserEarnings(account, farmsToFetch)

      return userFarmAllowances.map((farmAllowance, index) => {
        return {
          pid: farmsToFetch[index].pid,
          allowance: userFarmAllowances[index],
          tokenAllowance: userFarmTokenAllowances[index],
          quoteTokenAllowance: userFarmLPAllowances[index],
          tokenBalance: userFarmTokenBalances[index],
          tokenBalanceIB: userFarmTokenBalancesIB[index],
          quoteTokenBalance: userFarmQuoteTokenBalances[index],
          stakedBalance: userStakedBalances[index],
          earnings: userFarmEarnings[index],
          farmEarnings: userFarmlpEarnings[index],
        }
      })
    }
  ,
  )

export const leverageSlice = createSlice({
  name: 'leverage',
  initialState,
  reducers: {
    setLoadArchivedFarmsData: (state, action) => {
      const loadArchivedFarmsData = action.payload
      state.loadArchivedFarmsData = loadArchivedFarmsData
    },
  },
  extraReducers: (builder) => {
    // Update farms with live data
    builder.addCase(fetchLeverageFarmsPublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((farm) => {
        const liveFarmData = action.payload.find((farmData) => farmData.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    })

    // Update farms with user data
    builder.addCase(fetchLeverageFarmUserDataAsync.fulfilled, (state, action) => {
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
export const { setLoadArchivedFarmsData } = leverageSlice.actions

export default leverageSlice.reducer
