// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import farmsConfig from 'config/constants/farms'
// import isArchivedPid from 'utils/farmHelpers'
// import priceHelperLpsConfig from 'config/constants/priceHelperLps'

// import { FarmsState, Farm } from '../types'

// const noAccountFarmConfig = farmsConfig.map((farm) => ({
//   ...farm,
//   userData: {
//     allowance: '0',
//     tokenBalance: '0',
//     stakedBalance: '0',
//     earnings: '0',
//   },
// }))

// const initialState: FarmsState = { data: noAccountFarmConfig, loadArchivedFarmsData: false, userDataLoaded: false }

// export const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))



// interface FarmUserDataResponse {
//   pid: number
//   allowance: string
//   tokenBalance: string
//   stakedBalance: string
//   earnings: string
// }

// export const farmsSlice = createSlice({
//   name: 'Farms',
//   initialState,
//   reducers: {
//     setLoadArchivedFarmsData: (state, action) => {
//       const loadArchivedFarmsData = action.payload
//       state.loadArchivedFarmsData = loadArchivedFarmsData
//     },
//   },

// })

// // Actions
// export const { setLoadArchivedFarmsData } = farmsSlice.actions

// export default farmsSlice.reducer


import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import lendConfig from 'config/constants/lend'
import isArchivedPid from 'utils/farmHelpers'
import fetchFarms from './fetchLend'
import fetchFarmsPrices from './fetchLendPrices'
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from './fetchLendUser'
import { LendState, LendFarm } from '../types'

const noAccountFarmConfig = lendConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
  },
}))

const initialState: LendState = { data: noAccountFarmConfig, loadArchivedFarmsData: false, userDataLoaded: false }

export const nonArchivedFarms = lendConfig.filter(({ pid }) => !isArchivedPid(pid))

// Async thunks
export const fetchLendPublicDataAsync = 
createAsyncThunk<LendFarm[], number[]>(
  'lend/fetchLendPublicDataAsync',
  async (pids) => {
    const farmsToFetch = lendConfig.filter((farmConfig) => pids.includes(farmConfig.pid))

    const farms = await fetchFarms(farmsToFetch)
    const farmsWithPrices = await fetchFarmsPrices(farms)

    // Filter out price helper LP config farms
    const farmsWithoutHelperLps = farmsWithPrices.filter((farm: LendFarm) => {
      return farm.pid || farm.pid === 0
    })
    return farmsWithoutHelperLps
  }
  ,
)

interface LevarageFarmUserDataResponse {
  pid: number
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
}

export const fetchLendUserDataAsync = 
createAsyncThunk<LevarageFarmUserDataResponse[], { account: string; pids: number[] }>(
  'lend/fetchLendUserDataAsync',
  async ({ account, pids }) => {
    // console.info('account',account);console.info('pids',pids);
    const farmsToFetch = lendConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
    const userFarmAllowances = await fetchFarmUserAllowances(account, farmsToFetch)
    const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsToFetch)
    const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsToFetch)
    const userFarmEarnings = await fetchFarmUserEarnings(account, farmsToFetch)

    console.log("lend99999: ", farmsToFetch)
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

export const levarageSlice = createSlice({
  name: 'levarage',
  initialState,
  reducers: {
    setLoadArchivedFarmsData: (state, action) => {
      const loadArchivedFarmsData = action.payload
      state.loadArchivedFarmsData = loadArchivedFarmsData
    },
  },
  extraReducers: (builder) => {
    // Update farms with live data
    builder.addCase(fetchLendPublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((farm) => {
        const liveFarmData = action.payload.find((farmData) => farmData.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    })

    // Update farms with user data
    builder.addCase(fetchLendUserDataAsync.fulfilled, (state, action) => {
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
export const { setLoadArchivedFarmsData } = levarageSlice.actions

export default levarageSlice.reducer



