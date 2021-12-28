import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import fairLaunchABI from 'config/abi/fairLaunch.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { getFairLaunch } from 'utils/env'
import { LeverageFarmConfig } from 'config/constants/types'

export const fetchFarmUserAllowances = async (account: string, farmsToFetch: LeverageFarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    const baseTokenAddress = getAddress(farm.TokenInfo.token.address)
    return { address: baseTokenAddress, name: 'allowance', params: [account, farm.TokenInfo.vaultAddress] }
  })

  const rawVaultAllowances = await multicall(erc20ABI, calls)
  const parsedVaultAllowances = rawVaultAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedVaultAllowances
}

export const fetchFarmUserTokenAllowances = async (account: string, farmsToFetch: LeverageFarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    const tokenAddress = getAddress(farm.TokenInfo.token.address)
    return { address: tokenAddress, name: 'allowance', params: [account, farm.TokenInfo.vaultAddress] }
  })

  const rawVaultAllowances = await multicall(erc20ABI, calls)
  const parsedVaultAllowances = rawVaultAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })

  return parsedVaultAllowances
}

export const fetchFarmUserQuoteTokenAllowances = async (account: string, farmsToFetch: LeverageFarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    const tokenAddress = getAddress(farm.TokenInfo.quoteToken.address)
    return { address: tokenAddress, name: 'allowance', params: [account, farm.TokenInfo.vaultAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const quoteTokenAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })

  return quoteTokenAllowances
}

export const fetchFarmUserTokenBalancesIB = async (account: string, farmsToFetch: LeverageFarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    const vaultContractAddress = farm.TokenInfo.vaultAddress
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


export const fetchFarmUserTokenBalances = async (account: string, farmsToFetch: LeverageFarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    const vaultContractAddress = getAddress(farm.TokenInfo.token.address)
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

export const fetchFarmUserQuoteTokenBalances = async (account: string, farmsToFetch: LeverageFarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    const vaultContractAddress = getAddress(farm.TokenInfo.quoteToken.address)
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

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: LeverageFarmConfig[]) => {
  const fairLaunchAddress = getFairLaunch()

  const calls = farmsToFetch.map((farm) => {
    return {
      address: fairLaunchAddress,
      name: 'userInfo',
      params: [farm.TokenInfo.token.poolId, account],
    }
  })

  const rawStakedBalances = await multicall(fairLaunchABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: LeverageFarmConfig[]) => {
  const fairLaunchAddress = getFairLaunch()

  const calls = farmsToFetch.map((farm) => {
    return {
      address: fairLaunchAddress,
      name: 'pendingHusky',
      params: [farm.TokenInfo.token.poolId, account],
    }
  })

  const rawEarnings = await multicall(fairLaunchABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}

export const fetchFarmlpUserEarnings = async (account: string, farmsToFetch: LeverageFarmConfig[]) => {
  const fairLaunchAddress = getFairLaunch()

  const calls = farmsToFetch.map((farm) => {
    return {
      address: fairLaunchAddress,
      name: 'pendingHusky',
      params: [farm.TokenInfo.token.debtPoolId, account],
    }
  })

  const rawEarnings = await multicall(fairLaunchABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}
