/* eslint-disable no-restricted-properties */
import BigNumber from 'bignumber.js'
import { LevarageFarm } from 'state/types'
import { getBalanceNumber, getFullDisplayBalance, getDecimalAmount } from 'utils/formatBalance'
import { BLOCKS_PER_YEAR, DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'utils/config';

const mathematics1 = 0.4; // Less than 50% utilization
const mathematics2 = 0; // Between 50% and 90%
const mathematics3 = 13;

export const getAprData = (farm: LevarageFarm, cakePriceBusd: BigNumber, pooPerBlock: number) => {
  const { totalToken, totalSupply, vaultDebtVal, token } = farm
  const busdTokenPrice: any = token.busdPrice;
  const huskyPrice: any = cakePriceBusd;
  const poolAlpacaPerBlock = pooPerBlock;

  const utilization = parseInt(totalToken) > 0 ? parseInt(vaultDebtVal) / parseInt(totalToken) : 0;
  let landRate = 0;
  if (utilization < 0.5) {
    landRate = mathematics1 * utilization;
  } else if (utilization > 0.9) {
    landRate = mathematics3 * utilization - 11.5;
  } else {
    landRate = mathematics2 * utilization + 0.2;
  }

  const landApr = landRate * 0.9 * utilization;
  const stakeApr = BLOCKS_PER_YEAR.times(poolAlpacaPerBlock * huskyPrice).div(
    (busdTokenPrice * parseInt(totalToken) * parseInt(totalToken)) / parseInt(totalSupply)
  );
  const totalApr = BigNumber.sum(landApr, stakeApr);
  const apy = Math.pow(1 + totalApr.toNumber() / 365, 365) - 1;
  console.log({apy,landApr, stakeApr,totalApr });
  return apy;
}


