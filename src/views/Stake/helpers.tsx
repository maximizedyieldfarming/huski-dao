import BigNumber from 'bignumber.js'
import { Stake } from 'state/types'
import { BLOCKS_PER_YEAR } from 'utils/config';

export const getStakeApr = (farm: Stake, cakePriceBusd: BigNumber, pooPerBlock: number) => {
  const { totalToken, totalSupply, token } = farm
  const busdTokenPrice: any = token.busdPrice;
  const huskyPrice: any = cakePriceBusd;
  const poolAlpacaPerBlock = pooPerBlock;

  const stakeApr = BLOCKS_PER_YEAR.times(poolAlpacaPerBlock * huskyPrice).div(
    (busdTokenPrice * parseInt(totalToken) * parseInt(totalToken)) / parseInt(totalSupply)
  );
  // const apy = Math.pow(1 + stakeApr.toNumber() / 365, 365) - 1;
  return stakeApr;
}


