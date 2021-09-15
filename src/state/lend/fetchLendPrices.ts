import BigNumber from 'bignumber.js'
import Tokens from 'config/constants/tokens'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { LendFarm } from 'state/types'

// const getFarmFromTokenSymbol = (farms: LendFarm[], tokenSymbol: string, preferredQuoteTokens?: string[]): LendFarm => {
//   const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol)
//   const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)
//   return filteredFarm
// }

const getFarmBaseTokenPrice = (farm: LendFarm, quoteTokenFarm: LendFarm, bnbPriceBusd: BigNumber): BigNumber => {
  // const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)
  const hasTokenPriceVsQuote = Boolean(true)

  // if (farm.quoteToken.symbol === 'BUSD') {
  //   return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
  // }

  // if (farm.quoteToken.symbol === 'wBNB') {
  //   return hasTokenPriceVsQuote ? bnbPriceBusd.times(farm.tokenPriceVsQuote) : BIG_ZERO
  // }

  // We can only calculate profits without a quoteTokenFarm for BUSD/BNB farms
  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or wBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
  // from the BNB - pBTC price, we can calculate the PNT - BUSD price
  // if (quoteTokenFarm.quoteToken.symbol === 'wBNB') {
  //   const quoteTokenInBusd = bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote)
  //   return hasTokenPriceVsQuote && quoteTokenInBusd
  //     ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
  //     : BIG_ZERO
  // }

  // if (quoteTokenFarm.quoteToken.symbol === 'BUSD') {
  //   const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
  //   return hasTokenPriceVsQuote && quoteTokenInBusd
  //     ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
  //     : BIG_ZERO
  // }

  // Catch in case token does not have immediate or once-removed BUSD/wBNB quoteToken
  return BIG_ZERO
}

const getFarmQuoteTokenPrice = (farm: LendFarm, quoteTokenFarm: LendFarm, bnbPriceBusd: BigNumber): BigNumber => {
  if (farm.quoteToken.symbol === 'BUSD') {
    return BIG_ONE
  }

  if (farm.quoteToken.symbol === 'wBNB') {
    return bnbPriceBusd
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  // if (quoteTokenFarm.quoteToken.symbol === 'wBNB') {
  //   return quoteTokenFarm.tokenPriceVsQuote ? bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  // }

  // if (quoteTokenFarm.quoteToken.symbol === 'BUSD') {
  //   return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  // }

  return BIG_ZERO
}
const fetchAllPrices = async (tokens) => {
  const coingeckoIds = tokens.map((token) => {
    return token.coingeckoId
  })
  console.log(coingeckoIds)
  const tokensPriceCoinGecko = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds}&vs_currencies=usd&per_page=200`;
  const res = await fetch(tokensPriceCoinGecko);
  const data = await res.json();

  return data
}

const fetchFarmsPrices = async (farms) => {
  // const coingeckoPrices = fetchAllPrices(Tokens)

  const farmsWithPrices = farms.map((farm) => {
    // const quoteTokenFarm = getFarmFromTokenSymbol(farms, farm.quoteToken.symbol)
    // const baseTokenPrice = getFarmBaseTokenPrice(farm, quoteTokenFarm, bnbPriceBusd)
    // const quoteTokenPrice = getFarmQuoteTokenPrice(farm, quoteTokenFarm, bnbPriceBusd)
    // const token = { ...farm.token, busdPrice: baseTokenPrice.toJSON() }
    // const quoteToken = { ...farm.quoteToken, busdPrice: quoteTokenPrice.toJSON() }
    const token = { ...farm.token, busdPrice: 1 }
    const quoteToken = { ...farm.quoteToken, busdPrice: 11 }
    return { ...farm, token, quoteToken }
  })
  console.log("lend----: ", farmsWithPrices)

  return farmsWithPrices
}

export default fetchFarmsPrices
