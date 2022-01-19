/* eslint-disable no-restricted-properties */
import BigNumber from 'bignumber.js'
import { LeverageFarm } from 'state/types'
import { BLOCKS_PER_YEAR, BIG_ZERO } from 'utils/config';

export const getAprData = (farm: LeverageFarm, huskyPriceBusd, borrowingInterest?) => {
  const { totalToken, vaultDebtVal, poolLendPerBlock, tokenPriceUsd, tokenReserveFund } = farm

  const busdTokenPrice: any = tokenPriceUsd
  const huskyPrice: any = huskyPriceBusd;
  const poolHuskyPerBlock = poolLendPerBlock;
  const utilization: any = parseInt(totalToken) > 0 ?  new BigNumber(vaultDebtVal).div(new BigNumber(totalToken)) : BIG_ZERO;
  const reserveFund = parseInt(tokenReserveFund) / 10000;

  const lendApr = borrowingInterest * utilization * (1 - reserveFund)

  const stakeApr = parseInt(totalToken) ? BLOCKS_PER_YEAR.times(poolHuskyPerBlock * huskyPrice).div((parseInt(totalToken) * busdTokenPrice)) : BIG_ZERO
  const totalApr = BigNumber.sum(lendApr, stakeApr);
  const apy = Math.pow(1 + totalApr.toNumber() / 365, 365) - 1;

  return { lendApr, stakeApr, totalApr, apy };
}


