/* eslint-disable no-restricted-properties */
import BigNumber from 'bignumber.js'
import { LeverageFarm } from 'state/types'
import { getBalanceNumber, getFullDisplayBalance, getDecimalAmount } from 'utils/formatBalance'
import { BLOCKS_PER_YEAR, DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'utils/config';


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
