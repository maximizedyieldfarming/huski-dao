import BigNumber from 'bignumber.js'
import { LeverageFarm } from 'state/types'
import { CAKE_PER_YEAR, DEFAULT_TOKEN_DECIMAL, BLOCKS_PER_YEAR } from 'config'
import { dichotomybasetoken } from 'utils/pancakeService'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'

export const getHuskyRewards = (farm: LeverageFarm, cakePriceBusd: BigNumber, tokenName?: string) => {
  const { vaultDebtVal, token, quoteTokenVaultDebtVal, quoteToken, pooPerBlock, quoteTokenPoolPerBlock } = farm

  let vaultDebtValue
  let poolHuskyPerBlock

  if (tokenName?.toUpperCase() === quoteToken.symbol.toUpperCase()) {
    vaultDebtValue = quoteTokenVaultDebtVal
    poolHuskyPerBlock = quoteTokenPoolPerBlock
  } else {
    vaultDebtValue = vaultDebtVal
    poolHuskyPerBlock = pooPerBlock
  }

  const busdTokenPrice: any = tokenName?.toUpperCase() === quoteToken.symbol.toUpperCase() ? quoteToken.busdPrice : token.busdPrice;
  const huskyPrice: any = cakePriceBusd;
 
  const huskyRewards = BLOCKS_PER_YEAR.times(poolHuskyPerBlock * huskyPrice).div((parseInt(vaultDebtValue) * busdTokenPrice));
  return huskyRewards.toNumber();
}

export const getYieldFarming = (farm: LeverageFarm, cakePrice: BigNumber) => {
  const { poolWeight, quoteToken, lpTotalInQuoteToken } = farm
  const poolWeightBigNumber: any = new BigNumber(poolWeight)

  const poolLiquidityUsd = new BigNumber(lpTotalInQuoteToken).times(quoteToken.busdPrice)
  const yearlyCakeRewardAllocation = CAKE_PER_YEAR.times(poolWeightBigNumber)
  const yieldFarmingApr = yearlyCakeRewardAllocation.times(cakePrice).div(poolLiquidityUsd).times(100)

  return yieldFarmingApr.toNumber();
}

export const getTvl = (farm: LeverageFarm) => {
  const { tokenUserInfoLP, lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal, token, quoteToken } = farm

  const tokenPriceInUsd = new BigNumber(token.busdPrice)
  const quoteTokenPriceInUsd = new BigNumber(quoteToken.busdPrice)

  const tokensLP = new BigNumber(tokenUserInfoLP).div(DEFAULT_TOKEN_DECIMAL)
  const lpTokenRatio = new BigNumber(tokenUserInfoLP).div(new BigNumber(lptotalSupply))
  const tokenNum = new BigNumber(tokenAmountTotal).times(lpTokenRatio)
  const quoteTokenNum = new BigNumber(quoteTokenAmountTotal).times(lpTokenRatio)
  const tokenTvl = new BigNumber(tokenNum).times(tokenPriceInUsd)
  const quoteTokenTvl = new BigNumber(quoteTokenNum).times(quoteTokenPriceInUsd)
  // const tokenTvl = new BigNumber(tokenAmountTotal).times(tokenPriceInUsd).times(lpTokenRatio)
  // const quoteTokenTvl = new BigNumber(quoteTokenAmountTotal).times(quoteTokenPriceInUsd).times(lpTokenRatio)
  const totalTvl = BigNumber.sum(tokenTvl, quoteTokenTvl)
  return { tokensLP, tokenNum, quoteTokenNum, totalTvl };
}

export const getLeverageFarmingData = (farm: LeverageFarm, leverage, tokenInput, quoteTokenInput) => {
  const { tokenAmountTotal, quoteTokenAmountTotal } = farm
  const tokenInputNum = Number(tokenInput);
  const quoteTokenInputNum = Number(quoteTokenInput);
  const farmdata = dichotomybasetoken(leverage, 0.0025, tokenInputNum, quoteTokenInputNum, 0, 0, 0, parseFloat(tokenAmountTotal), parseFloat(quoteTokenAmountTotal))
  console.info('======farmdata======', farmdata);
  return farmdata
}

export const getAdjustData = (farm: LeverageFarm, data, leverage, tokenInput, quoteTokenInput) => {
  const { tokenAmountTotal, quoteTokenAmountTotal } = farm

  const debtValueData = data.debtValue
  const baseAmountData = data.baseAmount
  const farmAmountData = data.farmAmount

  const baseTokenAmount = new BigNumber(baseAmountData).dividedBy(BIG_TEN.pow(18))
  const farmTokenAmount = new BigNumber(farmAmountData).dividedBy(BIG_TEN.pow(18))
  const debtValue = new BigNumber(debtValueData).dividedBy(BIG_TEN.pow(18))
  const leverageAdjust = new BigNumber(debtValueData).div(new BigNumber(baseAmountData)).plus(1)

  const tokenInputNum = Number(tokenInput);
  const quoteTokenInputNum = Number(quoteTokenInput);

  const lvg = leverageAdjust.toNumber()
  const basetokenlp = baseTokenAmount.toNumber()
  const farmingtokenlp = farmTokenAmount.toNumber()
  const basetokenlpborrowed = debtValue.toNumber()

  // console.log({ tokenInputNum, quoteTokenInputNum, leverage, lvg, basetokenlp, farmingtokenlp, basetokenlpborrowed, 'tokenAmountTotal': parseFloat(tokenAmountTotal), 'quoteTokenAmountTotal': parseFloat(quoteTokenAmountTotal) });

  const farmdata = dichotomybasetoken( leverage , 0.0025, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotal), parseFloat(quoteTokenAmountTotal))
  console.info('======adjust======', farmdata);
  return farmdata
}

const mathematics1 = 0.1;
const mathematics2 = 4 / 55;
const mathematics3 = 92 / 5;
const mathematics1B = 3 / 40;
const mathematics2B = 3 / 55;
const mathematics3B = 94 / 5;

export const getBorrowingInterest = (farm: LeverageFarm, tokenName?: string) => {
  const { totalToken, vaultDebtVal, token, quoteTokenTotal, quoteTokenVaultDebtVal, quoteToken } = farm

  let totalTokenValue
  let vaultDebtValue
  let tokenSymbol
  if (tokenName?.toUpperCase() === quoteToken.symbol.toUpperCase()) {
    totalTokenValue = quoteTokenTotal
    vaultDebtValue = quoteTokenVaultDebtVal
   tokenSymbol = quoteToken.symbol.toUpperCase()
  } else {
    totalTokenValue = totalToken
    vaultDebtValue = vaultDebtVal
    tokenSymbol = token.symbol.toUpperCase()
  }

  const utilization = parseInt(totalTokenValue) > 0 ? parseInt(vaultDebtValue) / parseInt(totalTokenValue) : 0;

  let lendRate = 0;

  if (tokenSymbol === 'WBNB' || tokenSymbol === 'BUSD' || tokenSymbol === 'USDT' || tokenSymbol === 'HUSKI' || tokenSymbol === 'ALPACA') {
    if (utilization < 0.4) {
      lendRate = mathematics1B * utilization * 100;
    } else if (utilization > 0.95) {
      lendRate = mathematics3B * utilization * 100 - 1740;
    } else {
      lendRate = mathematics2B * utilization * 100 + 12 / 11;
    }
  } else if (tokenSymbol === 'BTCB' || tokenSymbol === 'ETH') {
    if (utilization < 0.4) {
      lendRate = mathematics1 * utilization * 100;
    } else if (utilization > 0.95) {
      lendRate = mathematics3 * utilization * 100 - 1780;
    } else {
      lendRate = mathematics2 * utilization * 100 + 9 / 11;
    }
  }

  const borrowingInterest = lendRate / (utilization * 100) / (1 - 0.16)

  return { borrowingInterest };
}


export const getAdjustPositionRepayDebt = (farm: LeverageFarm, data, leverage, ClosePositionPercentage) => {
  const { tokenAmountTotal, quoteTokenAmountTotal } = farm

  const debtValueData = data.debtValue
  const baseAmountData = data.baseAmount
  const farmAmountData = data.farmAmount
  const baseTokenAmount = new BigNumber(baseAmountData).dividedBy(BIG_TEN.pow(18))
  const farmTokenAmount = new BigNumber(farmAmountData).dividedBy(BIG_TEN.pow(18))
  const debtValue = new BigNumber(debtValueData).dividedBy(BIG_TEN.pow(18))

  const basetokenlp = baseTokenAmount.toNumber()
  const farmingtokenlp = farmTokenAmount.toNumber()
  const basetokenlpborrowed = debtValue.toNumber()

  const ClosePosFee = 5 / 100 / 100;
  const PancakeTradingFee = 0.25 / 100;
  const basetokenBegin = parseFloat(tokenAmountTotal)
  const farmingtokenBegin = parseFloat(quoteTokenAmountTotal)

  const num0 = (leverage - 1) / leverage * (basetokenlp + farmingtokenlp / farmingtokenBegin * basetokenBegin)
  const num1 = (basetokenlp * (1 - ClosePosFee) - num0)
  const num2 = num0 - basetokenlpborrowed + basetokenBegin
  const num3 = farmingtokenlp * (1 - ClosePosFee) * (1 - PancakeTradingFee)
  const numA = num1 * num3
  const numB = (num1 * farmingtokenBegin + num3 * num2)
  const numC = (num2 - basetokenBegin) * farmingtokenBegin
  const rationum = (0 - numB + (numB ** 2 - 4 * numA * numC) ** 0.5) / 2 / numA

  let needCloseBase
  let needCloseFarm
  let remainBase
  let remainFarm
  let remainBorrowBase
  let remainBorrowFarm
  let remainLeverage
  if (leverage > 1) {
    needCloseBase = basetokenlp * rationum
    needCloseFarm = farmingtokenlp * rationum
    const repaydebtnum = basetokenlp * rationum * (1 - ClosePosFee) + basetokenBegin - farmingtokenBegin * basetokenBegin / (farmingtokenlp * rationum * (1 - ClosePosFee) * (1 - PancakeTradingFee) + farmingtokenBegin)
    remainBase = basetokenlp * (1 - rationum)
    remainFarm = farmingtokenlp * (1 - rationum)
    remainBorrowBase = basetokenlpborrowed - repaydebtnum
    remainBorrowFarm = (basetokenlpborrowed - repaydebtnum) / (basetokenlp * (1 - rationum) + farmingtokenlp * (1 - rationum) / farmingtokenBegin * basetokenBegin - (basetokenlpborrowed - repaydebtnum)) + 1
    remainLeverage = (basetokenlpborrowed - repaydebtnum) / (basetokenlp * (1 - rationum) + farmingtokenlp * (1 - rationum) / farmingtokenBegin * basetokenBegin - (basetokenlpborrowed - repaydebtnum)) + 1
    // basetokenlpborrowed - repaydebtnum  
  } else if (leverage === 1) {
    needCloseBase = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
    needCloseFarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
    remainBase = 0
    remainFarm = 0
    remainBorrowBase = 0
    remainBorrowFarm = 0
    remainLeverage = 0
  }

  return { needCloseBase, needCloseFarm, remainBase, remainFarm, remainBorrowBase, remainBorrowFarm, remainLeverage };
}