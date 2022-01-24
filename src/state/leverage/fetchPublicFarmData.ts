import BigNumber from 'bignumber.js'
import masterchefABI from 'config/abi/masterchef.json'
import lpTokenABI from 'config/abi/lpToken.json'
import VaultABI from 'config/abi/vault.json'
import WorkerConfigABI from 'config/abi/WorkerConfig.json'
import SimpleVaultConfigABI from 'config/abi/SimpleVaultConfig.json'
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
  quoteTokenUserInfoLP: SerializedBigNumber
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
  quoteTokenLiquidationThreshold: SerializedBigNumber
  isStableToken: boolean
  isStableQuoteToken: boolean
  tokenMinDebtSize: SerializedBigNumber
  quoteTokenMinDebtSize: SerializedBigNumber
  tokenReserveFund: SerializedBigNumber
  pooPerBlock: number
  quoteTokenPoolPerBlock: number
  poolLendPerBlock: number
}

const fetchFarm = async (farm: LeverageFarm): Promise<PublicFarmData> => {
  const { lpAddresses, TokenInfo, QuoteTokenInfo, pid } = farm
  const lpAddress = getAddress(lpAddresses)
  const vaultAddresses = TokenInfo.vaultAddress
  const quoteTokenVaultAddresses = QuoteTokenInfo.vaultAddress
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

  // const [liquidationThreshold, quoteTokenLiquidationThreshold] =
  //   await multicall(WorkerConfigABI, [
  //     {
  //       address: TokenInfo.config,
  //       name: 'killFactor',
  //       params: [TokenInfo.address, 0],
  //     },
  //     {
  //       address: QuoteTokenInfo.config,
  //       name: 'killFactor',
  //       params: [QuoteTokenInfo.address, 0],
  //     }
  //   ])


  let isStableToken = false
  let isStableQuoteToken = false
  try {

    const [isStableToken1, isStableQuoteToken1] =
      await multicall(WorkerConfigABI, [
        {
          address: TokenInfo.config,
          name: 'isStable',
          params: [TokenInfo.address],
        },
        {
          address: TokenInfo.config,
          name: 'isStable',
          params: [TokenInfo.address],
        },
      ])

    isStableToken = true // isStableToken1
    isStableQuoteToken = true // isStableQuoteToken1
  } catch (error) {
    // oracle machine do not work
    isStableToken = false
    isStableQuoteToken = false
  }


  const [tokenMinDebtSize, quoteTokenMinDebtSize, tokenReserveFund] =
    await multicall(SimpleVaultConfigABI, [
      {
        address: getAddress(TokenInfo.token.config),
        name: 'minDebtSize',
      },
      {
        address: getAddress(QuoteTokenInfo.token.config),
        name: 'minDebtSize',
      },
      {
        address: getAddress(TokenInfo.token.config),
        name: 'getReservePoolBps',
      }
    ])


  const [totalSupply, totalToken, vaultDebtVal, quoteTokenTotalSupply, quoteTokenTotal, quoteTokenVaultDebtVal] =
    await multicall(VaultABI, [
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
      address: getAddress(TokenInfo.token.address),
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: getAddress(TokenInfo.quoteToken.address),
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
      address: getAddress(TokenInfo.token.address),
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: getAddress(TokenInfo.quoteToken.address),
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

  const [infoLend, huskiPerBlockLend, totalAllocPointLend, infoFL, huskyPerBlock, totalAllocPointFL, quoteTokenInfo, quoteTokenAlpacaPerBlock, quoteTokenTotalAllocPoint] =
    TokenInfo.token?.poolId || TokenInfo.token?.poolId === 0
      ? await multicall(fairLaunchABI, [
        {
          address: getFairLaunch(),
          name: 'poolInfo',
          params: [TokenInfo.token?.poolId],
        },
        {
          address: getFairLaunch(),
          name: 'huskyPerBlock',
        },
        {
          address: getFairLaunch(),
          name: 'totalAllocPoint',
        },
        {
          address: getFairLaunch(),
          name: 'poolInfo',
          params: [TokenInfo.token?.debtPoolId],
        },
        {
          address: getFairLaunch(),
          name: 'huskyPerBlock',
        },
        {
          address: getFairLaunch(),
          name: 'totalAllocPoint',
        },
        {
          address: getFairLaunch(),
          name: 'poolInfo',
          params: [TokenInfo.quoteToken?.debtPoolId],
        },
        {
          address: getFairLaunch(),
          name: 'huskyPerBlock',
        },
        {
          address: getFairLaunch(),
          name: 'totalAllocPoint',
        },
      ])
      : [null, null]

console.log({infoLend, huskiPerBlockLend, totalAllocPointLend, infoFL, huskyPerBlock, totalAllocPointFL, quoteTokenInfo, quoteTokenAlpacaPerBlock, quoteTokenTotalAllocPoint})
  // const [infoFL, huskyPerBlock, totalAllocPointFL] =
  //   TokenInfo.token?.debtPoolId || TokenInfo.token?.debtPoolId === 0
  //     ? await multicall(fairLaunchABI, [
  //       {
  //         address: getFairLaunch(),
  //         name: 'poolInfo',
  //         params: [TokenInfo.token?.debtPoolId],
  //       },
  //       {
  //         address: getFairLaunch(),
  //         name: 'huskyPerBlock',
  //       },
  //       {
  //         address: getFairLaunch(),
  //         name: 'totalAllocPoint',
  //       },
  //     ])
  //     : [null, null]


  // const [quoteTokenInfo, quoteTokenAlpacaPerBlock, quoteTokenTotalAllocPoint] =
  //   TokenInfo.quoteToken?.debtPoolId || TokenInfo.quoteToken?.debtPoolId === 0
  //     ? await multicall(fairLaunchABI, [
  //       {
  //         address: getFairLaunch(),
  //         name: 'poolInfo',
  //         params: [TokenInfo.quoteToken?.debtPoolId],
  //       },
  //       {
  //         address: getFairLaunch(),
  //         name: 'huskyPerBlock',
  //       },
  //       {
  //         address: getFairLaunch(),
  //         name: 'totalAllocPoint',
  //       },
  //     ])
  //     : [null, null]

  const masterChefAddress = getMasterChefAddress()
  const [info, totalAllocPoint, tokenUserInfo, quoteTokenUserInfo] =
    pid || pid === 0
      ? await multicall(masterchefABI, [
        {
          address: masterChefAddress,
          name: 'poolInfo',
          params: [pid],
        },
        {
          address: masterChefAddress,
          name: 'totalAllocPoint',
        },
        {
          address: masterChefAddress,
          name: 'userInfo',
          params: [pid, TokenInfo.address],
        },
        {
          address: masterChefAddress,
          name: 'userInfo',
          params: [pid, QuoteTokenInfo.address],
        }
      ])
      : [null, null]

  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
  const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO
  const pooPerBlock = huskyPerBlock * infoFL.allocPoint / totalAllocPointFL;
  const quoteTokenPoolPerBlock = quoteTokenAlpacaPerBlock * quoteTokenInfo.allocPoint / quoteTokenTotalAllocPoint;
  const poolLendPerBlock = huskiPerBlockLend * infoLend.allocPoint / totalAllocPointLend;
console.log({quoteTokenAlpacaPerBlock,quoteTokenInfo, quoteTokenTotalAllocPoint ,'TokenInfo.quoteToken':TokenInfo.quoteToken, 'TokenInfo.quoteToken?.debtPoolId': TokenInfo.quoteToken?.debtPoolId  })

  return {
    lptotalSupply: lptotalSupply[0]._hex,
    quoteTokenTotalSupply: quoteTokenTotalSupply[0]._hex,
    quoteTokenTotal: quoteTokenTotal[0]._hex,
    quoteTokenVaultDebtVal: quoteTokenVaultDebtVal[0]._hex,
    totalSupply: totalSupply[0]._hex,
    totalToken: totalToken[0]._hex,
    vaultDebtVal: vaultDebtVal[0]._hex,
    tokenReserve: lpTotalReserves[0]._hex,
    quoteTokenReserve: lpTotalReserves[1]._hex,
    tokenUserInfoLP: tokenUserInfo[0]._hex,
    quoteTokenUserInfoLP: quoteTokenUserInfo[0]._hex,
    tokenAmountTotal: tokenAmountTotal.toJSON(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toJSON(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
    poolWeight: poolWeight.toJSON(),
    pooPerBlock,
    quoteTokenPoolPerBlock,
    poolLendPerBlock,
    tokenBalanceLP: tokenBalanceLP[0]._hex,
    quoteTokenBalanceLP: quoteTokenBalanceLP[0]._hex,
    liquidationThreshold: "0x208d", // liquidationThreshold[0]._hex,
    quoteTokenLiquidationThreshold: "0x208d", // quoteTokenLiquidationThreshold[0]._hex,
    isStableToken,
    isStableQuoteToken,
    tokenMinDebtSize: tokenMinDebtSize[0]._hex,
    quoteTokenMinDebtSize: quoteTokenMinDebtSize[0]._hex,
    tokenReserveFund: tokenReserveFund[0]._hex,
  }
}

export default fetchFarm
