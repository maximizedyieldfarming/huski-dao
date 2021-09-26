import BigNumber from 'bignumber.js'
import { LeverageFarm } from 'state/types'
import { CAKE_PER_YEAR } from 'config'
import { ChainId } from '@pancakeswap/sdk'
import { getFarmApr } from 'utils/apr'

// price = BaseToken_usd / HUSKI_usd
// HUSKIRewards = HUSKI_block * 365  * 24 * 60 *  60 / 3 / TotalBorrowed * (Leverage - 1) / price
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

