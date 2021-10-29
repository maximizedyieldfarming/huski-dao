/* eslint-disable no-restricted-properties */
import BigNumber from 'bignumber.js'
import { Stake } from 'state/types'
import { BLOCKS_PER_YEAR } from 'utils/config';

export const getStakeApy = (stake: Stake, huskyPriceBusd: BigNumber) => {
  const { totalToken, token, pooPerBlock } = stake

  const busdTokenPrice: any = token.busdPrice;
  const huskyPrice: any = huskyPriceBusd;
  const poolHuskyPerBlock = pooPerBlock;
  // const stakeApr = BLOCKS_PER_YEAR.times(poolHuskyPerBlock * huskyPrice).div(
  //   (busdTokenPrice * parseInt(totalToken) * parseInt(totalToken)) / parseInt(totalSupply)
  // );
  const stakeApr = BLOCKS_PER_YEAR.times(poolHuskyPerBlock * huskyPrice).div((parseInt(totalToken) * busdTokenPrice));
  const apy = Math.pow(1 + stakeApr.toNumber() / 365, 365) - 1;
  return { stakeApr, apy };
}
