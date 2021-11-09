import BigNumber from 'bignumber.js'
import { LeverageFarm } from 'state/types'
import { CAKE_PER_YEAR, DEFAULT_TOKEN_DECIMAL, BLOCKS_PER_YEAR } from 'config'
import { dichotomybasetoken } from 'utils/pancakeService'
import { BIG_TEN } from 'utils/bigNumber'

export const getHuskyRewards = (farm: LeverageFarm, cakePriceBusd: BigNumber, tokenName?: string) => {
  const { vaultDebtVal, TokenInfo, quoteTokenVaultDebtVal, pooPerBlock, quoteTokenPoolPerBlock, tokenPriceUsd, quoteTokenPriceUsd } = farm
  const { token, quoteToken } = TokenInfo
  let vaultDebtValue
  let poolHuskyPerBlock

  if (tokenName?.toUpperCase() === quoteToken?.symbol.toUpperCase() || tokenName?.toUpperCase() === quoteToken?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
    vaultDebtValue = quoteTokenVaultDebtVal
    poolHuskyPerBlock = quoteTokenPoolPerBlock
  } else {
    vaultDebtValue = vaultDebtVal
    poolHuskyPerBlock = pooPerBlock
  }

  const busdTokenPrice: any = tokenName?.toUpperCase() === quoteToken?.symbol.toUpperCase() ? quoteTokenPriceUsd : tokenPriceUsd;
  const huskyPrice: any = cakePriceBusd;

  const huskyRewards = BLOCKS_PER_YEAR.times(poolHuskyPerBlock * huskyPrice).div((parseInt(vaultDebtValue) * busdTokenPrice));
  return huskyRewards.toNumber();
}

export const getYieldFarming = (farm: LeverageFarm, cakePrice: BigNumber) => {
  const { poolWeight, TokenInfo, lpTotalInQuoteToken, tokenPriceUsd, quoteTokenPriceUsd } = farm
  const { quoteToken } = TokenInfo
  const poolWeightBigNumber: any = new BigNumber(poolWeight)

  const poolLiquidityUsd = new BigNumber(lpTotalInQuoteToken).times(quoteTokenPriceUsd)
  const yearlyCakeRewardAllocation = CAKE_PER_YEAR.times(poolWeightBigNumber)
  const yieldFarmingApr = yearlyCakeRewardAllocation.times(cakePrice).div(poolLiquidityUsd).times(100)

  // console.log({poolWeight, TokenInfo, lpTotalInQuoteToken, quoteTokenPriceUsd , poolWeightBigNumber,poolLiquidityUsd, yearlyCakeRewardAllocation,   yieldFarmingApr  })

  return yieldFarmingApr.toNumber();
}

export const getTvl = (farm: LeverageFarm) => {
  const { tokenUserInfoLP, lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal, TokenInfo, tokenPriceUsd, quoteTokenPriceUsd } = farm
  const { token, quoteToken } = TokenInfo
  const tokenPriceInUsd = new BigNumber(tokenPriceUsd)
  const quoteTokenPriceInUsd = new BigNumber(quoteTokenPriceUsd)

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

export const getLeverageFarmingData = (farm: LeverageFarm, leverage, tokenInput, quoteTokenInput, tokenName?: string) => {
  const { tokenAmountTotal, quoteTokenAmountTotal, TokenInfo } = farm

  let tokenAmountTotalNum
  let quoteTokenAmountTotalNum
  let tokenInputNum
  let quoteTokenInputNum
  if (TokenInfo?.token?.symbol?.toLowerCase() === tokenName?.toLowerCase()) {
    tokenInputNum = Number(tokenInput);
    quoteTokenInputNum = Number(quoteTokenInput);
    tokenAmountTotalNum = tokenAmountTotal;
    quoteTokenAmountTotalNum = quoteTokenAmountTotal;
  } else {
    tokenInputNum = Number(quoteTokenInput);
    quoteTokenInputNum = Number(tokenInput);
    tokenAmountTotalNum = quoteTokenAmountTotal;
    quoteTokenAmountTotalNum = tokenAmountTotal;
  }

  const farmdata = dichotomybasetoken(0, leverage, 0.0025, tokenInputNum, quoteTokenInputNum, 0, 0, 0, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum))
  // console.info('======farmdata======', farmdata);
  return farmdata
}

export const getAdjustData = (farm: LeverageFarm, data, leverage, tokenInput, quoteTokenInput, tokenName?: string) => {
  const { TokenInfo, lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal } = farm

  let tokenAmountTotalNum
  let quoteTokenAmountTotalNum
  let tokenInputNum
  let quoteTokenInputNum
  if (TokenInfo?.token?.symbol?.toUpperCase() === tokenName?.toUpperCase() || tokenName?.toUpperCase() === TokenInfo?.token?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
    tokenInputNum = Number(tokenInput);
    quoteTokenInputNum = Number(quoteTokenInput);
    tokenAmountTotalNum = tokenAmountTotal;
    quoteTokenAmountTotalNum = quoteTokenAmountTotal;
  } else {
    tokenInputNum = Number(quoteTokenInput);
    quoteTokenInputNum = Number(tokenInput);
    tokenAmountTotalNum = quoteTokenAmountTotal;
    quoteTokenAmountTotalNum = tokenAmountTotal;
  }

  const { lpAmount } = data
  const debtValueData = data.debtValue
  const baseTokenAmount = new BigNumber(tokenAmountTotalNum).div(new BigNumber(lptotalSupply)).times(lpAmount)
  const farmTokenAmount = new BigNumber(quoteTokenAmountTotalNum).div(new BigNumber(lptotalSupply)).times(lpAmount)
  const debtValue = new BigNumber(debtValueData).dividedBy(BIG_TEN.pow(18))
  // const leverageAdjust = new BigNumber(baseTokenAmount).times(2).div((new BigNumber(baseTokenAmount).times(2)).minus(new BigNumber(debtValue)))
  // const tokenInputNum = Number(tokenInput);
  // const quoteTokenInputNum = Number(quoteTokenInput);
  // const lvg = leverageAdjust.toNumber()
  const basetokenlp = baseTokenAmount.toNumber()
  const farmingtokenlp = farmTokenAmount.toNumber()
  const basetokenlpborrowed = debtValue.toNumber()

  console.log({ tokenName, tokenInputNum, quoteTokenInputNum, leverage, basetokenlp, farmingtokenlp, basetokenlpborrowed, 'tokenAmountTotal': parseFloat(tokenAmountTotalNum), 'quoteTokenAmountTotal': parseFloat(quoteTokenAmountTotalNum) });

  const farmdata = dichotomybasetoken(1, leverage, 0.0025, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum))
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
  const { totalToken, vaultDebtVal, TokenInfo, quoteTokenTotal, quoteTokenVaultDebtVal } = farm
  const { token, quoteToken } = TokenInfo
  let totalTokenValue
  let vaultDebtValue
  let tokenSymbol
  if (tokenName?.toUpperCase() === quoteToken?.symbol.toUpperCase() || tokenName?.toUpperCase() === quoteToken?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
    totalTokenValue = quoteTokenTotal
    vaultDebtValue = quoteTokenVaultDebtVal
    tokenSymbol = quoteToken?.symbol.toUpperCase()
  } else {
    totalTokenValue = totalToken
    vaultDebtValue = vaultDebtVal
    tokenSymbol = token?.symbol.toUpperCase()
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


export const getAdjustPositionRepayDebt = (farm: LeverageFarm, data, leverage, ClosePositionPercentage, tokenName?: string) => {

  const { lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal, TokenInfo } = farm
  const { quoteToken } = TokenInfo
  let tokenAmountTotalValue
  let quoteTokenAmountTotalValue
  if (tokenName?.toUpperCase() === quoteToken?.symbol.toUpperCase() || tokenName?.toUpperCase() === quoteToken?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
    tokenAmountTotalValue = quoteTokenAmountTotal
    quoteTokenAmountTotalValue = tokenAmountTotal
  } else {
    tokenAmountTotalValue = tokenAmountTotal
    quoteTokenAmountTotalValue = quoteTokenAmountTotal
  }

  const { lpAmount } = data
  const debtValueData = data.debtValue
  const baseTokenAmount = new BigNumber(tokenAmountTotalValue).div(new BigNumber(lptotalSupply)).times(lpAmount)
  const farmTokenAmount = new BigNumber(quoteTokenAmountTotalValue).div(new BigNumber(lptotalSupply)).times(lpAmount)
  const debtValue = new BigNumber(debtValueData).dividedBy(BIG_TEN.pow(18))
  const basetokenlp = baseTokenAmount.toNumber()
  const farmingtokenlp = farmTokenAmount.toNumber()
  const basetokenlpborrowed = debtValue.toNumber()

  const ClosePosFee = 5 / 100 / 100;
  const PancakeTradingFee = 0.25 / 100;
  const basetokenBegin = parseFloat(tokenAmountTotalValue)
  const farmingtokenBegin = parseFloat(quoteTokenAmountTotalValue)

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
  } else if (Number(leverage) === 1) {
    needCloseBase = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
    needCloseFarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
    remainBase = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
    remainFarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
    remainBorrowBase = 0
    remainBorrowFarm = 0
    remainLeverage = 0
  }

  return { needCloseBase, needCloseFarm, remainBase, remainFarm, remainBorrowBase, remainBorrowFarm, remainLeverage };
}


export const getPriceImpact = (farm: LeverageFarm, tokenInput, tokenName?: string) => {
  const { tokenAmountTotal, quoteTokenAmountTotal, TokenInfo } = farm

  let tokenAmountTotalNum
  let tokenInputNum
  if (TokenInfo?.token?.symbol?.toLowerCase() === tokenName?.toLowerCase() || TokenInfo?.token?.symbol?.replace('wBNB', 'BNB').toLowerCase() === tokenName?.toLowerCase()) {
    tokenInputNum = Number(tokenInput);
    tokenAmountTotalNum = tokenAmountTotal;
  } else {
    tokenInputNum = Number(tokenInput);
    tokenAmountTotalNum = quoteTokenAmountTotal;
  }

  const baseTokenEnd = new BigNumber(tokenInputNum).plus(new BigNumber(tokenAmountTotalNum))
  const priceImpact = new BigNumber(tokenInputNum).div(new BigNumber(baseTokenEnd))

  return priceImpact.toNumber()
}