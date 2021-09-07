/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import Web3 from 'web3';
import getDomain from '../utils/env';

const web3 = new Web3(getDomain());

export const fetchTokenIdFromList = async (tokenZeroSymbol, tokenOneSymbol) => {
    // this is the endpoint to query symbols of coins. We will need this later on to get the symbol of the coins of the pools
  // because coingecko allows to query for token price only with a token id as argument which in some cases is different from
  // from the token symbol. Example: while we use symbols like cake for the pancake token, coingecko wants to be fed with
  // their token id for cake which is called pancakeswap-token.
  const tokenSymbolCoinGeckoApi = `https://api.coingecko.com/api/v3/coins/list`;

 
  const listRaw = await fetch(tokenSymbolCoinGeckoApi);
  const list = await listRaw.json();


  // tokenZeroSymbol, tokenOneSymbol
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const getCoinGeckoTokenIds = (tokenZeroSymbol) => {
    const tokenId = list.filter((token:any) => {
      if (tokenZeroSymbol.toLowerCase() === token.symbol){
        return token.id
      }
    })
    // console.info('tokenId', tokenId)
    return tokenId
  }


  // return getCoinGeckoTokenIds();
  const tokenId = getCoinGeckoTokenIds(tokenZeroSymbol)
  console.log('tokenId', tokenId)
}

// this function is in test. Now working on moving the data to the farm page
export const fetchTokenPrice = async (tokenZeroSymbol, tokenOneSymbol) => {

  const enumsSymbol = {
    'cake': 'pancakeswap-token',
    'btcb': 'binance-bitcoin',
    'eth': 'ethereum',
    'dot': 'polkadot',
    'bnb': 'binancecoin',
    'alpaca': 'alpaca-finance',
    'usdt': 'tether',
    'busd': 'binance-usd',
    'beth': 'binance-eth',
    'xvs': 'venus',
    'link': 'chainlink',
    'yfi': 'yearn-finance',
    'usdc': 'usd-coin',
    'ust': 'wrapped-ust',
    'comp': 'compound-coin',
    'itam': 'itam-games',
    'bmxx': 'multiplier-bsc',
    'bor': 'boringdao-[old]',
    'bry': 'berry-data',
    'uni': 'uniswap',
    'default': ''
    // 'comp': 'compound-governance-token'
  }
  let tokenZeroSymbol1 = enumsSymbol[tokenZeroSymbol];
  let tokenOneSymbol1 = enumsSymbol[tokenOneSymbol];
  if (!tokenZeroSymbol1) {
    tokenZeroSymbol1 = tokenZeroSymbol;
  }
  if (!tokenOneSymbol1) {
    tokenOneSymbol1 = tokenOneSymbol;
  }
  // to consider there is a limit to the number of request to coingecko. If we call the list and filter for tokens to find
  // the id needed to feed the price token api we will make 2 api call per user instead of 1
  const tokenPriceCoinGeckoApi = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenZeroSymbol1}%2C${tokenOneSymbol1}&vs_currencies=usd`;
  const res = await fetch(tokenPriceCoinGeckoApi);
  const data = await res.json();
  // because CoinGecko is so dumb to return the tokens prices not in order of token symbol requested we need to make sure token zero is token <zero></zero>
  const priceTokenZero = data[tokenZeroSymbol1];
  const priceTokenOne = data[tokenOneSymbol1];

  return [priceTokenZero, priceTokenOne];
};

export const fetchCakePrice = async () => {
  const cakePriceCoinGeckoApi = `https://api.coingecko.com/api/v3/simple/price?ids=pancakeswap-token&vs_currencies=usd`;
  const res = await fetch(cakePriceCoinGeckoApi);
  const cakePrice = await res.json();
  return cakePrice['pancakeswap-token'].usd;
};

export const truncateAddress = (account, left = 4, right = 4) => {
  if (typeof account !== 'string') {
    account.toString();
  }
  const first = account.slice(0, left);
  const last = account.slice(-right);
  return first.concat('...', last);
};

export const copyToClipboard = (id) => {
  const r = document.createRange();
  r.selectNode(document.getElementById(id));
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(r);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
};

export const splitPairs = (pair) => {
  return pair.toLowerCase().split('-');
};

export const renderPairsAvatars = (pair, n, Icons) => {
  const [pair1, pair2] = splitPairs(pair);
  return n === 1 ? Icons[pair1] : Icons[pair2];
};

export const formatBigNumber = (value: any) => {
  return parseInt(web3.utils.fromWei(BigInt(value).toString())).toLocaleString(
    'en-US'
    // {
    //   minimumFractionDigits: 2,
    //   maximumFractionDigits: 2,
    // }
  );
};

export const formatPercentage = (value) => {
  return value.toLocaleString('en', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const sumLendingPoolData = (url, lendingData, loading, lendingPoolData, data) => {

    let finalResult;
    // eslint-disable-next-line prefer-const
    finalResult = lendingPoolData
          // eslint-disable-next-line no-useless-escape
          .map((pool) => parseFloat(formatBigNumber(pool[data]).replace(/\,/g, '')))
          .reduce((cur, acc) => cur + acc)
          .toLocaleString()
    return finalResult;
};

export const sumTokenData = (data) => {
      let finalResult;
      // eslint-disable-next-line prefer-const
      finalResult = data
            // eslint-disable-next-line no-useless-escape
            .map((pool) => parseFloat(formatBigNumber(pool).replace(/\,/g, '')))
            .reduce((cur, acc) => cur + acc)
            .toLocaleString()
      return finalResult;
  };
