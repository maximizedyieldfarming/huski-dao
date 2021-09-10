/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'
import { levarageFarmsConfig } from 'config/constants'
import { tokensBegin, getYieldFarmAPR } from 'utils/pancakeService';
import { fetchFarmsPublicDataAsync, fetchFarmUserDataAsync, nonArchivedFarms } from '.'
import { fetchTokenPrice, fetchCakePrice, formatPercentage } from '../utils'
import { State, Farm, FarmsState } from '../types'
import mainnet from '../../mainnet.json'


export const usePollFarmsPublicData = (includeArchive = false) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const farmsToFetch = includeArchive ? levarageFarmsConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchFarmsPublicDataAsync(pids))
  }, [includeArchive, dispatch, slowRefresh])
}

export const usePollFarmsWithUserData = (includeArchive = false) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const farmsToFetch = includeArchive ? levarageFarmsConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchFarmsPublicDataAsync(pids))

    if (account) {
      dispatch(fetchFarmUserDataAsync({ account, pids }))
    }
  }, [includeArchive, dispatch, slowRefresh, account])
}

/**
 * Fetches the "core" farm data used globally
 * 251 = CAKE-BNB LP
 * 252 = BUSD-BNB LP
 */
export const usePollCoreFarmData = () => {
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync([251, 252]))
  }, [dispatch, fastRefresh])
}

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
}

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const farm = useFarmFromPid(pid)
  return farm && new BigNumber(farm.token.busdPrice)
}

export const useLpTokenPrice = (symbol: string) => {
  const farm = useFarmFromLpSymbol(symbol)
  const farmTokenPriceInUsd = useBusdPriceFromPid(farm.pid)
  let lpTokenPrice = BIG_ZERO

  if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(new BigNumber(farm.lpTotalSupply))
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}

// /!\ Deprecated , use the BUSD hook in /hooks
export const useFarmsData = () => {
  const [cakePrice, setCakePrice] = useState();
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

        const getCakePrice = async () => {
          const cakePrice1 = await fetchCakePrice();
          setCakePrice(cakePrice1);
        };
        getCakePrice();
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
        setFarmsData(values)
      })
      .catch((error) => console.error('error', error));
  }, [cakePrice, setFarmsData])
  return { farmsData }

}
