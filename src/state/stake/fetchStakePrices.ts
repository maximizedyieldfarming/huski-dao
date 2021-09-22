import BigNumber from 'bignumber.js'
import farmTokens from 'config/constants/farmTokens'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'
import { LeverageFarm } from 'state/types'

const getFarmBaseTokenPrice = (farm: LeverageFarm, coingeckoPrices: any): BigNumber => {
  let baseTokenPrice = BIG_ZERO
  coingeckoPrices.forEach(coingeckoPrice => {
    if (coingeckoPrice.id === farm.token.coingeckoId) {
      baseTokenPrice = new BigNumber(coingeckoPrice.current_price)
    }
  })
  return baseTokenPrice
}

const fetchFarmsPrices = async (farms) => {
  const coingeckoIds = farmTokens.map((token) => {
    return token.coingeckoId
  })
  const tokensPriceCoinGecko = `https://api.coingecko.com/api/v3/coins/markets?ids=${coingeckoIds}&vs_currency=usd&per_page=200`;
  const res = await fetch(tokensPriceCoinGecko);
  const coingeckoPrices = await res.json();

  const farmsWithPrices = farms.map((farm) => {
    const baseTokenPrice = getFarmBaseTokenPrice(farm, coingeckoPrices)
    const token = { ...farm.token, busdPrice: baseTokenPrice.toJSON() }
    return { ...farm, token }
  })
  return farmsWithPrices
}

export default fetchFarmsPrices
