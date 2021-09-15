import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import fairLaunchABI from 'config/abi/fairLaunch.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { getFairLaunch } from 'utils/env'
import { LendConfig } from 'config/constants/types'

export const fetchFarmUserAllowances = async (account: string, farmsToFetch: LendConfig[]) => {
  console.info('111111');
  const calls = farmsToFetch.map((farm) => {
    const baseTokenAddress = getAddress(farm.token.address)
    return { address: baseTokenAddress, name: 'allowance', params: [account, getAddress(farm.address)] }
  })

  const rawVaultAllowances = await multicall(erc20ABI, calls)
  const parsedVaultAllowances = rawVaultAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedVaultAllowances
}

export const fetchFarmUserTokenBalances = async (account: string, farmsToFetch: LendConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    const vaultContractAddress = getAddress(farm.address)
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

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: LendConfig[]) => {
  const fairLaunchAddress = getFairLaunch()

  const calls = farmsToFetch.map((farm) => {
    return {
      address: fairLaunchAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawStakedBalances = await multicall(fairLaunchABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: LendConfig[]) => {
  const fairLaunchAddress = getFairLaunch()

  const calls = farmsToFetch.map((farm) => {
    return {
      address: fairLaunchAddress,
      name: 'pendingAlpaca',
      params: [farm.pid, account],
    }
  })

  const rawEarnings = await multicall(fairLaunchABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}
