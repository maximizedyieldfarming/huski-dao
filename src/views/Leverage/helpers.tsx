import BigNumber from 'bignumber.js'
import { LeverageFarm } from 'state/types'
import { CAKE_PER_YEAR } from 'config'
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
  const { tokenReserve, quoteTokenReserve, poolWeight, quoteToken, token, lpTotalInQuoteToken } = farm

  const poolLiquidityUsd = new BigNumber(lpTotalInQuoteToken).times(quoteToken.busdPrice)
  const poolWeightBigNumber: any =new BigNumber(poolWeight)

  // const reserve0: any = parseInt(tokenReserve);
  // const reserve1: any = parseInt(quoteTokenReserve);
  // const poolLiquidityUsd: any = BigNumber.sum(reserve0, reserve1);

  const yearlyCakeRewardAllocation = CAKE_PER_YEAR.times(poolWeightBigNumber)
  const yieldFarmingApr = yearlyCakeRewardAllocation.times(cakePrice).div(poolLiquidityUsd)

  // const yieldFarmingApr = CAKE_PER_YEAR.times(poolWeightBigNumber * cakePrice).div(
  //   poolLiquidityUsd
  // );
  console.log({'poolWeight':poolWeightBigNumber,'cakePrice':cakePrice.toNumber(),'poolLiquidityUsd':poolLiquidityUsd.toNumber(), quoteToken,  CAKE_PER_YEAR, yieldFarmingApr,});
  console.info('yieldFarmingApr', yieldFarmingApr.toNumber());

  return yieldFarmingApr;
}