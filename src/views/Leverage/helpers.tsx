import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { LeverageFarm } from 'state/types'
import { CAKE_PER_YEAR, DEFAULT_TOKEN_DECIMAL, BLOCKS_PER_YEAR } from 'config'
import { ChainId } from '@pancakeswap/sdk'
import { getFarmingData, dichotomybasetoken } from 'utils/pancakeService'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'

export const getHuskyRewards = (farm: LeverageFarm, cakePriceBusd: BigNumber, pooPerBlock1: number, leverage) => {
  const { vaultDebtVal, token, pooPerBlock } = farm
  const busdTokenPrice: any = token.busdPrice;
  const huskyPrice: any = cakePriceBusd;
  const poolHuskyPerBlock = pooPerBlock // pooPerBlock1;
// 259976557516924427536707
  const huskyRewards = BLOCKS_PER_YEAR.times(poolHuskyPerBlock * (leverage - 1) * huskyPrice).div((parseInt(vaultDebtVal) * busdTokenPrice));

  return huskyRewards.toNumber();
}

export const getYieldFarming = (farm: LeverageFarm, cakePrice: BigNumber) => {
  const { poolWeight, quoteToken, lpTotalInQuoteToken } = farm
  const poolWeightBigNumber: any =new BigNumber(poolWeight)

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
  return { tokensLP,tokenNum,quoteTokenNum,totalTvl };
}

export const getLeverageFarmingData = (farm: LeverageFarm, leverage, tokenInput, quoteTokenInput) => {
  const { tokenAmountTotal, quoteTokenAmountTotal } = farm

  const tokenInputNum = Number(tokenInput);
  const quoteTokenInputNum = Number(quoteTokenInput);
// console.log({leverage, tokenInputNum, quoteTokenInputNum,'11': parseInt(tokenAmountTotal),})
  const farmdata = getFarmingData(leverage, tokenInputNum, quoteTokenInputNum, parseInt(tokenAmountTotal), parseInt(quoteTokenAmountTotal), 0.0025)
//  console.info(farmdata)
    // const aaa = dichotomybasetoken( 2.05, 0.0025,  0.04, 0.0065, 0.195,4.42, 0.201,   869611 , 19689464)
  // console.info('aaaaaaaaaaaa--在这里！！-', aaa)
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
  //   '1': leverageAdjust.toNumber().toFixed(2),
  //   tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed,
  //   'baseTokenAmount': baseTokenAmount.toNumber(), 'farmTokenAmount': farmTokenAmount.toNumber().toFixed(3),
  //   'debtValue': debtValue.toNumber().toFixed(3), tokenAmountTotal, quoteTokenAmountTotal
  // })

  const farmdata = dichotomybasetoken(lvg , 0.0025, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp , basetokenlpborrowed , parseInt(tokenAmountTotal), parseInt(quoteTokenAmountTotal))
  return farmdata
}