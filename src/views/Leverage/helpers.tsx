import BigNumber from 'bignumber.js'
import { LeverageFarm } from 'state/types'
import { CAKE_PER_YEAR } from 'utils/config';
// price = BaseToken_usd / HUSKI_usd
// HUSKIRewards = HUSKI_block * 365  * 24 * 60 *  60 / 3 / TotalBorrowed * (Leverage - 1) / price
export const getHuskyRewards = (farm: LeverageFarm, cakePriceBusd: BigNumber, pooPerBlock: number) => {
  const { totalToken, vaultDebtVal, token, leverage } = farm
  const busdTokenPrice: any = token.busdPrice;
  const huskyPrice: any = cakePriceBusd;
  const poolHuskyPerBlock = pooPerBlock;

  // const huskyRewards = BLOCKS_PER_YEAR.times(poolHuskyPerBlock * huskyPrice).div(
  //   (busdTokenPrice * parseInt(totalToken) * parseInt(totalToken)) / (parseInt(vaultDebtVal) * (leverage - 1) )
  // );
  const huskyRewards = poolHuskyPerBlock * 365 * 24 * 60 * 60 / 3 / parseInt(vaultDebtVal) * (leverage - 1) / (busdTokenPrice / huskyPrice)

  return huskyRewards;
}

export const getYieldFarming = (farm: LeverageFarm, cakePriceBusd: BigNumber) => {
  const { totalToken, vaultDebtVal, token, leverage, poolWeight } = farm
  const busdTokenPrice: any = token.busdPrice;
  const cakePrice:any = cakePriceBusd;
  const yieldFarmingApr = CAKE_PER_YEAR.times(parseInt(poolWeight) * cakePrice).div(
    busdTokenPrice
  );
  

  return yieldFarmingApr;
}