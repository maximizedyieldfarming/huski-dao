/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'
import { tokensBegin, getYieldFarmAPR } from 'utils/pancakeService';
import mainnet from '../../mainnet.json'
import { fetchTokenIdFromList, fetchTokenPrice, fetchCakePrice, formatPercentage } from '../utils'

export const useFarmsData = () => {

  // const [cakePrice, setCakePrice] = useState();
  const [farmsData, setFarmsData] = useState([]);
  useEffect(() => {
    const cleanPools = mainnet.Exchanges.Pancakeswap.LpTokens.filter((lpPool: any) => {
      if (!lpPool.name.includes('Legacy')) {
        lpPool.name = lpPool.name.replace(' LP', '');
        return lpPool;
      }
    });

    const farmPools = cleanPools.map((lpPool: any) => {
      const processPools = async () => {
        // get the 2 token symbols
        const [tokenZeroSymbol, tokenOneSymbol] = lpPool.name.split('-');
        lpPool.tokenZeroSymbol = tokenZeroSymbol;
        lpPool.tokenOneSymbol = tokenOneSymbol;

        // get reserves token 0 and token 1
        const tokensBeginBalances = await tokensBegin(lpPool.address);
        lpPool.reserveTokenZero = tokensBeginBalances[0];
        lpPool.reserveTokenOne = tokensBeginBalances[1];

        // get the Coingecko token id from the mainnet token symbol
        // const tokenZeroId = await fetchTokenIdFromList(tokenZeroSymbol, tokenOneSymbol);// 暂时zhudiao
        // console.info('tokenZeroId:::::::; ', tokenZeroId);

        // get token0 price and token1 price
        const prices = await fetchTokenPrice(tokenZeroSymbol.toLowerCase(), tokenOneSymbol.toLowerCase());
        lpPool.priceTokenZero = prices[0].usd;
        lpPool.priceTokenOne = prices[1].usd;

        // calculate and store tvl
        const tvl0 = (lpPool.reserveTokenZero / 10 ** 18) * lpPool.priceTokenZero;
        const tvl1 = (lpPool.reserveTokenOne / 10 ** 18) * lpPool.priceTokenOne;
        const totalTvlNumber = tvl0 + tvl1;
        lpPool.tvl = totalTvlNumber.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        const cakePrice = await fetchCakePrice();

        console.info('121212',cakePrice );
        // create the object with pId, cakeprice and tvl
        if (cakePrice) {
          const param = { pId: lpPool.pId, cakePrice, tvl: totalTvlNumber };
          const poolApy = await getYieldFarmAPR(param);
          lpPool.apy = formatPercentage(poolApy);
        }
        return lpPool;
      }
      const poolData = processPools();
      return poolData;
    });
    Promise.all(farmPools)
      .then((values) => {
        console.info('values----', values);
        setFarmsData(values)
      })
      .catch((error) => console.error('error', error));
  }, [setFarmsData])
  return { farmsData }

}
