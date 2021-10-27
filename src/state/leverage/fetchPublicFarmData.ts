import BigNumber from 'bignumber.js'
import masterchefABI from 'config/abi/masterchef.json'
import lpTokenABI from 'config/abi/lpToken.json'
import VaultABI from 'config/abi/vault.json'
import WorkerConfigABI from 'config/abi/WorkerConfig.json'
import erc20 from 'config/abi/erc20.json'
import fairLaunchABI from 'config/abi/fairLaunch.json'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getFairLaunch } from 'utils/env'
import multicall from 'utils/multicall'
import { LeverageFarm, SerializedBigNumber } from '../types'

type PublicFarmData = {
  lptotalSupply: SerializedBigNumber
  tokenUserInfoLP: SerializedBigNumber
  borrowingInterest: SerializedBigNumber
  tokenAmountTotal: SerializedBigNumber
  quoteTokenAmountTotal: SerializedBigNumber
  quoteTokenTotalSupply: SerializedBigNumber
  quoteTokenTotal: SerializedBigNumber
  quoteTokenVaultDebtVal: SerializedBigNumber
  totalSupply: SerializedBigNumber
  totalToken: SerializedBigNumber
  vaultDebtVal: SerializedBigNumber
  tokenReserve: SerializedBigNumber
  lpTotalInQuoteToken: SerializedBigNumber
  quoteTokenReserve: SerializedBigNumber
  tokenBalanceLP: SerializedBigNumber
  quoteTokenBalanceLP: SerializedBigNumber
  poolWeight: SerializedBigNumber
  liquidationThreshold: SerializedBigNumber
  name: string
  multiplier: string
  pooPerBlock: number
}

const fetchFarm = async (farm: LeverageFarm): Promise<PublicFarmData> => {
  const { poolId, lpAddresses, workerAddress, quoteTokenWorkerAddress, workerConfig, token, quoteToken, vaultAddress, quoteTokenVaultAddress, pid } = farm
  const lpAddress = getAddress(lpAddresses)
  const vaultAddresses = getAddress(vaultAddress)
  const quoteTokenVaultAddresses = getAddress(quoteTokenVaultAddress)
  const workerAddresses = getAddress(workerAddress)
  const quotetokenWorkerAddress = getAddress(quoteTokenWorkerAddress)
  const workerConfigAddress = getAddress(workerConfig)
  const [lpTotalReserves, lptotalSupply] =
    await multicall(lpTokenABI, [
      {
        address: lpAddress,
        name: 'getReserves',
      },
      {
        address: lpAddress,
        name: 'totalSupply',
      },
    ])

  const [liquidationThreshold] =
    await multicall(WorkerConfigABI, [
      {
        address: workerConfigAddress,
        name: 'killFactor',
        params: [workerAddresses, 0],
      }
    ])

  const [liquidationThresholdquoteToken] =
    await multicall(WorkerConfigABI, [
      {
        address: workerConfigAddress,
        name: 'killFactor',
        params: [quotetokenWorkerAddress, 0],
      }
    ])

  const [name, borrowingInterest, totalSupply, totalToken, vaultDebtVal] =
    await multicall(VaultABI, [
      {
        address: vaultAddresses,
        name: 'name',
      },
      {
        address: vaultAddresses,
        name: 'pendingInterest',
        params: [0],
      },
      {
        address: vaultAddresses,
        name: 'totalSupply',
      },
      {
        address: vaultAddresses,
        name: 'totalToken',
      },
      {
        address: vaultAddresses,
        name: 'vaultDebtVal',
      },
    ])

    const [quoteTokenTotalSupply, quoteTokenTotal, quoteTokenVaultDebtVal] =
    await multicall(VaultABI, [
      {
        address: quoteTokenVaultAddresses,
        name: 'totalSupply',
      },
      {
        address: quoteTokenVaultAddresses,
        name: 'totalToken',
      },
      {
        address: quoteTokenVaultAddresses,
        name: 'vaultDebtVal',
      },
    ])

  const calls = [
    // Balance of token in the LP contract
    {
      address: getAddress(token.address),
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: getAddress(quoteToken.address),
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [getMasterChefAddress()],
    },
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: getAddress(token.address),
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: getAddress(quoteToken.address),
      name: 'decimals',
    },
  ]
  const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
    await multicall(erc20, calls)

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals))
  const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals))

  // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
  const tokenAmountMc = tokenAmountTotal.times(lpTokenRatio)
  const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

  // Total staked in LP, in quote token value
  const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))


  // Only make masterchef calls if farm has pid
  const [infoFL, alpacaPerBlock, totalAllocPointFL] =
  poolId || poolId === 0
      ? await multicall(fairLaunchABI, [
          {
            address: getFairLaunch(),
            name: 'poolInfo',
            params: [poolId],
          },
          {
            address: getFairLaunch(),
            name: 'alpacaPerBlock',
          },
          {
            address: getFairLaunch(),
            name: 'totalAllocPoint',
          },
        ])
      : [null, null]


  const masterChefAddress = getMasterChefAddress()
  const [info, cakePerBlock, totalAllocPoint, userInfo] =
    pid || pid === 0
      ? await multicall(masterchefABI, [
        {
          address: masterChefAddress,
          name: 'poolInfo',
          params: [pid],
        },
        {
          address: masterChefAddress,
          name: 'cakePerBlock',
        },
        {
          address: masterChefAddress,
          name: 'totalAllocPoint',
        },
        {
          address: masterChefAddress,
          name: 'userInfo',
          params: [pid, workerAddresses],
        }
      ])
      : [null, null]

  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
  const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO
  const pooPerBlock = alpacaPerBlock * infoFL.allocPoint / totalAllocPointFL;

  return {
    name,
    lptotalSupply: lptotalSupply[0]._hex,
    borrowingInterest: borrowingInterest[0]._hex,
    quoteTokenTotalSupply: quoteTokenTotalSupply[0]._hex,
    quoteTokenTotal: quoteTokenTotal[0]._hex,
    quoteTokenVaultDebtVal: quoteTokenVaultDebtVal[0]._hex,
    totalSupply: totalSupply[0]._hex,
    totalToken: totalToken[0]._hex,
    vaultDebtVal: vaultDebtVal[0]._hex,
    tokenReserve: lpTotalReserves[0]._hex,
    quoteTokenReserve: lpTotalReserves[1]._hex,
    tokenUserInfoLP: userInfo[0]._hex,
    tokenAmountTotal: tokenAmountTotal.toJSON(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toJSON(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
    poolWeight: poolWeight.toJSON(),
    multiplier: `${allocPoint.div(100).toString()}XqQ`,
    pooPerBlock,
    tokenBalanceLP: tokenBalanceLP[0]._hex,
    quoteTokenBalanceLP: quoteTokenBalanceLP[0]._hex,
    liquidationThreshold: liquidationThreshold[0]._hex,
  }
}

export default fetchFarm
