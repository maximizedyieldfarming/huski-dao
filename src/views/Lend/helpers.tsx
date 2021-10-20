/* eslint-disable no-restricted-properties */
import BigNumber from 'bignumber.js'
import { LeverageFarm } from 'state/types'
import { BLOCKS_PER_YEAR } from 'utils/config';

const mathematics1 = 0.1;
const mathematics2 = 4 / 55;
const mathematics3 = 92 / 5;
const mathematics1B = 3 / 40;
const mathematics2B = 3 / 55;
const mathematics3B = 94 / 5;

export const getAprData = (farm: LeverageFarm, cakePriceBusd: BigNumber, pooPerBlock: number) => {
  const { totalToken, totalSupply, vaultDebtVal, token } = farm
  const busdTokenPrice: any = token.busdPrice;
  const huskyPrice: any = cakePriceBusd;
  const poolHuskyPerBlock = pooPerBlock;

  const utilization = parseInt(totalToken) > 0 ? parseInt(vaultDebtVal) / parseInt(totalToken) : 0;

  let lendRate = 0;
  // TO CHECK 只有这几个的区分吗？ alpaca？
  if (token.symbol.toUpperCase() === 'WBNB' || token.symbol.toUpperCase() === 'BUSD' || token.symbol.toUpperCase() === 'USDT' || token.symbol.toUpperCase() === 'HUSKI' || token.symbol.toUpperCase() === 'ALPACA') {
    if (utilization < 0.4) {
      lendRate = mathematics1B * utilization * 100;
    } else if (utilization > 0.95) {
      lendRate = mathematics3B * utilization * 100 - 1740;
    } else {
      lendRate = mathematics2B * utilization * 100 + 12 / 11;
    }
  } else if (token.symbol.toUpperCase() === 'BTCB' || token.symbol.toUpperCase() === 'ETH') {
    if (utilization < 0.4) {
      lendRate = mathematics1 * utilization * 100;
    } else if (utilization > 0.95) {
      lendRate = mathematics3 * utilization * 100 - 1780;
    } else {
      lendRate = mathematics2 * utilization * 100 + 9 / 11;
    }
  }

  const lendApr = lendRate / 100 
  const BorrowingInterest = lendRate / (utilization * 100) / (1.0 - 0.16)

  // const huskyRewards = BLOCKS_PER_YEAR.times(poolHuskyPerBlock * huskyPrice).div((parseInt(totalSupply) * busdTokenPrice));
  // const stakeApr1 = 365 * 24 * 60 * 60 / 3 * 4 * 225 / 1910 * 0.915 / (484.651 * 332.76 * 1000)

  const stakeApr = BLOCKS_PER_YEAR.times(poolHuskyPerBlock * huskyPrice).div(
    (busdTokenPrice * parseInt(totalToken) * parseInt(totalToken)) / parseInt(totalSupply)
  );
  const totalApr = BigNumber.sum(lendApr, stakeApr);
  const apy = Math.pow(1 + totalApr.toNumber() / 365, 365) - 1;

  return { lendApr, stakeApr, totalApr, apy };
}


