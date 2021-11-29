import Web3 from 'web3';
import getDomain from '../utils/env';

const web3 = new Web3(getDomain());

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
