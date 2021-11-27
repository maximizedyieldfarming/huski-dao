import Web3 from 'web3';
import getDomain from '../utils/env';

const web3 = new Web3(getDomain());

// export const fetchCakePrice = async () => {
//   const cakePriceCoinGeckoApi = `https://api.coingecko.com/api/v3/simple/price?ids=pancakeswap-token&vs_currencies=usd`;
//   const res = await fetch(cakePriceCoinGeckoApi);
//   const cakePrice = await res.json();
//   return cakePrice['pancakeswap-token'].usd;
// };

// export const truncateAddress = (account, left = 4, right = 4) => {
//   if (typeof account !== 'string') {
//     account.toString();
//   }
//   const first = account.slice(0, left);
//   const last = account.slice(-right);
//   return first.concat('...', last);
// };

// export const copyToClipboard = (id) => {
//   const r = document.createRange();
//   r.selectNode(document.getElementById(id));
//   window.getSelection().removeAllRanges();
//   window.getSelection().addRange(r);
//   document.execCommand('copy');
//   window.getSelection().removeAllRanges();
// };

// export const splitPairs = (pair) => {
//   return pair.toLowerCase().split('-');
// };

// export const renderPairsAvatars = (pair, n, Icons) => {
//   const [pair1, pair2] = splitPairs(pair);
//   return n === 1 ? Icons[pair1] : Icons[pair2];
// };

export const formatBigNumber = (value) => {
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


// export const sumTokenData = (data) => {
//       let finalResult;
//       // eslint-disable-next-line prefer-const
//       finalResult = data
//             // eslint-disable-next-line no-useless-escape
//             .map((pool) => parseFloat(formatBigNumber(pool).replace(/\,/g, '')))
//             .reduce((cur, acc) => cur + acc)
//             .toLocaleString()
//       return finalResult;
//   };
