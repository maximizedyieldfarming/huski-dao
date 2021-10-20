import BigNumber from 'bignumber.js'
import { LeverageFarm } from 'state/types'
import { CAKE_PER_YEAR, DEFAULT_TOKEN_DECIMAL, BLOCKS_PER_YEAR } from 'config'
import { getFarmingData, dichotomybasetoken } from 'utils/pancakeService'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'

export const getHuskyRewards = (farm: LeverageFarm, cakePriceBusd: BigNumber, pooPerBlock: number, leverage) => {
  const { vaultDebtVal, token } = farm
  const busdTokenPrice: any = token.busdPrice;
  const huskyPrice: any = cakePriceBusd;
  const poolHuskyPerBlock = pooPerBlock

  const huskyRewards = BLOCKS_PER_YEAR.times(poolHuskyPerBlock * (leverage - 1) * huskyPrice).div((parseInt(vaultDebtVal) * busdTokenPrice));

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
  console.log({ tokenInputNum, quoteTokenInputNum, 'tokenAmountTotal': parseFloat(tokenAmountTotal), 'quoteTokenAmountTotal': parseFloat(quoteTokenAmountTotal) });
  // const farmdata = getFarmingData(leverage, tokenInputNum, quoteTokenInputNum, parseFloat(tokenAmountTotal), parseFloat(quoteTokenAmountTotal), 0.0025)
  // console.info('farmdata', farmdata);
  const farmdata = dichotomybasetoken(leverage, 0.0025, tokenInputNum, quoteTokenInputNum, 0, 0, 0, parseFloat(tokenAmountTotal), parseFloat(quoteTokenAmountTotal))
  // console.info('farmdata----', farmdata1);
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

  // console.log({
  //   'lvg': leverageAdjust.toNumber(),
  //   tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed,
  //   'baseTokenAmount': baseTokenAmount.toNumber(), 'farmTokenAmount': farmTokenAmount.toNumber(),
  //   'debtValue': debtValue.toNumber(), tokenAmountTotal, quoteTokenAmountTotal
  // })

  console.log({ tokenInputNum, quoteTokenInputNum, lvg, basetokenlp, farmingtokenlp, basetokenlpborrowed, 'tokenAmountTotal': parseFloat(tokenAmountTotal), 'quoteTokenAmountTotal': parseFloat(quoteTokenAmountTotal) });

  const farmdata = dichotomybasetoken(2.5, 0.0025, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotal), parseFloat(quoteTokenAmountTotal))
  console.info('======adjust======', farmdata);
  return farmdata
}

const mathematics1 = 0.1;
const mathematics2 = 4 / 55;
const mathematics3 = 92 / 5;
const mathematics1B = 3 / 40;
const mathematics2B = 3 / 55;
const mathematics3B = 94 / 5;

export const getBorrowingInterest = (farm: LeverageFarm) => {
  const { totalToken, vaultDebtVal, token } = farm

  const utilization = parseInt(totalToken) > 0 ? parseInt(vaultDebtVal) / parseInt(totalToken) : 0;

  let lendRate = 0;

  if (token.symbol.toUpperCase() === 'WBNB' || token.symbol.toUpperCase() === 'BUSD' || token.symbol.toUpperCase() === 'USDT' || token.symbol.toUpperCase() === 'HUSKI' || token.symbol.toUpperCase() === 'ALPACA') {
    if (utilization < 0.4) {
      lendRate = mathematics1B * utilization * 100;
    } else if (utilization > 0.95) {
      lendRate = mathematics3B * utilization * 100 - 1740;
    } else {
      lendRate = mathematics2B * utilization * 100 + 12 / 11;
    }
  } else if (token.symbol.toUpperCase() === 'BTCB' || token.symbol.toUpperCase() === 'ETH') {
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