import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import fairLaunchABI from 'config/abi/fairLaunch.json'
import huskyTokenABI from 'config/abi/huskyToken.json'
import multicall from 'utils/multicall'
import { getAddress, getHuskiAddress } from 'utils/addressHelpers'
import { getFairLaunch } from 'utils/env'
import { StakeConfig } from 'config/constants/types'

export const fetchFarmUserAllowances = async (account: string, farmsToFetch: StakeConfig[]) => {
  const calls = farmsToFetch.map((stake) => {
    const baseTokenAddress = getAddress(stake.vaultAddress)
    return { address: baseTokenAddress, name: 'allowance', params: [account, getAddress(stake.fairLaunchAddress)] }
  })

  const rawVaultAllowances = await multicall(erc20ABI, calls)
  const parsedVaultAllowances = rawVaultAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })

  return parsedVaultAllowances
}

export const fetchFarmUserTokenBalances = async (account: string, farmsToFetch: StakeConfig[]) => {
  const calls = farmsToFetch.map((stake) => {
    const vaultContractAddress = getAddress(stake.vaultAddress)
    return {
      address: vaultContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: StakeConfig[]) => {
  const fairLaunchAddress = getFairLaunch()

  const calls = farmsToFetch.map((stake) => {
    return {
      address: fairLaunchAddress,
      name: 'userInfo',
      params: [stake.pid, account],
    }
  })

  const rawStakedBalances = await multicall(fairLaunchABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: StakeConfig[]) => {
  const fairLaunchAddress = getFairLaunch()

  const calls = farmsToFetch.map((stake) => {
    return {
      address: fairLaunchAddress,
      name: 'pendingAlpaca',
      params: [stake.pid, account],
    }
  })

  const rawEarnings = await multicall(fairLaunchABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}

export const fetchFarmUserLocked = async (account: string, farmsToFetch: StakeConfig[]) => {
  const huskiAddress = getHuskiAddress()

  const calls = farmsToFetch.map((stake) => {
    return {
      address: huskiAddress,
      name: 'lockOf',
      params: [account],
    }
  })

  const data = await multicall(huskyTokenABI, calls)
  const parsedLocked = data.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedLocked
}

export const fetchFarmUserUnLocked = async (account: string, farmsToFetch: StakeConfig[]) => {
  const huskiAddress = getHuskiAddress()

  const calls = farmsToFetch.map((stake) => {
    return {
      address: huskiAddress,
      name: 'canUnlockAmount',
      params: [account],
    }
  })

  const data = await multicall(huskyTokenABI, calls)
  const parsedUnLocked = data.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedUnLocked
}
