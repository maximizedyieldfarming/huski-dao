import BigNumber from 'bignumber.js'
import farmTokens from 'config/constants/farmTokens'
import { BIG_ZERO } from 'utils/bigNumber'
import { Stake } from 'state/types'

const getFarmBaseTokenPrice = (stake: Stake, coingeckoPrices: any): BigNumber => {
  let baseTokenPrice = BIG_ZERO
  coingeckoPrices.forEach(coingeckoPrice => {
    if (coingeckoPrice.id === stake.token.coingeckoId) {
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

  const farmsWithPrices = farms.map((stake) => {
    const baseTokenPrice = getFarmBaseTokenPrice(stake, coingeckoPrices)
    const token = { ...stake.token, busdPrice: baseTokenPrice.toJSON() }
    return { ...stake, token }
  })
  return farmsWithPrices
}

export default fetchFarmsPrices
