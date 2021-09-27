import BigNumber from 'bignumber.js'
import { LeverageFarm } from 'state/types'
import { CAKE_PER_YEAR, DEFAULT_TOKEN_DECIMAL, BLOCKS_PER_YEAR } from 'config'
import { ChainId } from '@pancakeswap/sdk'
import { getFarmApr } from 'utils/apr'

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
  const { tokenAmountTotal,quoteTokenAmountTotal, tokenBalanceLP, quoteTokenBalanceLP, tokenReserve, quoteTokenReserve, token, quoteToken } = farm

const tokenPriceInUsd = new BigNumber(token.busdPrice)
const quoteTokenPriceInUsd = new BigNumber(quoteToken.busdPrice)

// const tvl0 = tokenPriceInUsd.times(tokenAmountTotal)
// const tvl2 = quoteTokenPriceInUsd.times(quoteTokenAmountTotal)

// 不对，0和1 值总是差不多的，很奇怪。怪不得乘以2
// ttt与pancake上面的 Liquidity 值差不多，
// const ttt = BigNumber.sum(tvl0,tvl2)
//  '-----zong--------':ttt.toNumber(),'000-':tvl0.toNumber(),'111-':tvl2.toNumber(),
// const a1 =new BigNumber(tokenBalanceLP).times(tokenPriceInUsd).div(DEFAULT_TOKEN_DECIMAL)
// const a2 = new BigNumber(quoteTokenBalanceLP).times(quoteTokenPriceInUsd).div(DEFAULT_TOKEN_DECIMAL)

  const tvl00 =new BigNumber(tokenReserve).times(tokenPriceInUsd).div(DEFAULT_TOKEN_DECIMAL)
  const tvl1 = new BigNumber(quoteTokenReserve).times(quoteTokenPriceInUsd).div(DEFAULT_TOKEN_DECIMAL)

  const t123 = BigNumber.sum(tvl00,tvl1)
  console.log({'sum====':t123.toNumber(),'000=a1':tvl00.toNumber(),'111=a2':tvl1.toNumber(),   token, quoteToken })
 return 11; // totalTvl.toNumber();
}

  //       lpPool.tvl = totalTvl.toLocaleString('en-US', {
  //         style: 'currency',
  //         currency: 'USD',
  //         minimumFractionDigits: 0,
  //         maximumFractionDigits: 0,
  //       });



  // const tokensPriceCoinGecko = `https://api.coingecko.com/api/v3/coins/markets?ids=${coingeckoIds}&vs_currency=usd&per_page=200`;
  // const res = await fetch(tokensPriceCoinGecko);
  // const coingeckoPrices = await res.json();