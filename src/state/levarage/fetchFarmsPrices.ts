import BigNumber from 'bignumber.js'
import farmTokens from 'config/constants/farmTokens'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { LevarageFarm } from 'state/types'

// const getFarmFromTokenSymbol = (farms: LevarageFarm[], tokenSymbol: string, preferredQuoteTokens?: string[]): LevarageFarm => {
//   const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol)
//   const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)
//   return filteredFarm
// }

const getFarmBaseTokenPrice = (farm: LevarageFarm, coingeckoPrices: any): BigNumber => {
  let baseTokenPrice = BIG_ZERO
  coingeckoPrices.forEach(coingeckoPrice => {
    if (coingeckoPrice.id === farm.token.coingeckoId) {
      baseTokenPrice = new BigNumber(coingeckoPrice.current_price)
    }
  })

  return baseTokenPrice
}

const getFarmQuoteTokenPrice = (farm: LevarageFarm, coingeckoPrices: any): BigNumber => {
  let quoteTokenPrice = BIG_ZERO
  coingeckoPrices.forEach(coingeckoPrice => {
    if (coingeckoPrice.id === farm.quoteToken.coingeckoId) {
      quoteTokenPrice = new BigNumber(coingeckoPrice.current_price)
    }
  })

  return quoteTokenPrice
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
    const quoteTokenPrice = getFarmQuoteTokenPrice(farm, coingeckoPrices)
    const token = { ...farm.token, busdPrice: baseTokenPrice.toJSON() }
    const quoteToken = { ...farm.quoteToken, busdPrice: quoteTokenPrice.toJSON() }
    return { ...farm, token, quoteToken }
  })
  // console.log("levarage farmsWithPrices----------: ", farmsWithPrices)

  return farmsWithPrices
}

export default fetchFarmsPrices
