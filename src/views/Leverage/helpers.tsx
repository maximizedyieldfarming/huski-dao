import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { LeverageFarm } from 'state/types'
import { CAKE_PER_YEAR, DEFAULT_TOKEN_DECIMAL, BLOCKS_PER_YEAR } from 'config'
import { ChainId } from '@pancakeswap/sdk'
import { getFarmingData } from 'utils/pancakeService'
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript'

export const getHuskyRewards = (farm: LeverageFarm, cakePriceBusd: BigNumber, pooPerBlock: number) => {
  const { vaultDebtVal, token, leverage } = farm
  const busdTokenPrice: any = token.busdPrice;
  const huskyPrice: any = cakePriceBusd;
  const poolHuskyPerBlock = pooPerBlock;

  // const huskyRewards = BLOCKS_PER_YEAR.times(poolHuskyPerBlock * huskyPrice).div(
  //   (busdTokenPrice * parseInt(totalToken) * parseInt(totalToken)) / (parseInt(vaultDebtVal) * (leverage - 1) )
  // );
  const huskyRewards = poolHuskyPerBlock * 365 * 24 * 60 * 60 / 3 / parseInt(vaultDebtVal) * (leverage - 1) / (busdTokenPrice / huskyPrice)

  return huskyRewards;
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

export const getTradingFees = (farm: LeverageFarm) => {

//   const fetchData = async () => {
//     try {
//       const response = await fetch('https://api.alpacafinance.org/v1/internal/tradingFee')

//       const responseData = await response.json()

//     } catch (error) {
//       console.error('Unable to fetch data:', error)
//     }
//   }

//   fetchData()

}

export const getLeverageFarmingData = (farm: LeverageFarm, leverage, tokenInput, quoteTokenInput) => {
  const { tokenAmountTotal, quoteTokenAmountTotal } = farm

  console.log({leverage, tokenInput, quoteTokenInput, tokenAmountTotal, quoteTokenAmountTotal })
const tokenInputNum =Number(tokenInput);
const quoteTokenInputNum = Number(quoteTokenInput);

  const farmdata = getFarmingData(leverage, tokenInputNum, quoteTokenInputNum, parseInt(tokenAmountTotal), parseInt(quoteTokenAmountTotal), 0.0025)
  console.info('farmdata',farmdata)
  return farmdata
}
