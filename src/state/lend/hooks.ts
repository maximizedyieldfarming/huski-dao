import { useEffect, useMemo, useCallback, useState  } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { getPoolInfo, getPoolInfo1, getSumLendData, getStakeValue, getStakeApr } from 'utils/vaultService'
import { farmsConfig } from 'config/constants'
import useRefresh from 'hooks/useRefresh'
import { getPoolHuskyDaily } from 'utils/fairLaunchService'
import { State, Farm, FarmsState } from '../types'
import mainnet from '../../mainnet.json'
import { sumLendingPoolData, sumTokenData } from '../utils'

/**
 * Fetches the "core" farm data used globally
 * 251 = CAKE-BNB LP
 * 252 = BUSD-BNB LP
 */

 export const loadBloackchainData =  () => {

  const lendingData = mainnet.Vaults.map((pool) => {
    const loadLendingData = async () => {
      const dataPool = await getPoolInfo(pool);
      dataPool.name = dataPool.name.replace('Interest Bearing ', '');
      return dataPool;
    };
    return loadLendingData();
  });
  Promise.all(lendingData)
    .then((values) => {
      console.info(values);
      return values;
    })
    .catch((error) => console.error('error', error));    

  // const loadLendingData = async () => {
  //     const dataPool = await getPoolInfo1(mainnet.Vaults);
  //     console.info('datapool',dataPool);
  //     return dataPool;
  //   };
  //   return loadLendingData();

}


// use this
export const useLendData =  () => {
  const [lendData, setLendData] = useState([])
  useEffect(() => {
    const lendingData = mainnet.Vaults.map((pool) => {
      const loadLendingData = async () => {
        const dataPool = await getPoolInfo(pool);
        dataPool.name = dataPool.name.replace('Interest Bearing ', '');
        return dataPool;
      };
      return loadLendingData();
    });

    Promise.all(lendingData)
    .then((values) => {
      setLendData(values)
    })
    .catch((error) => console.error('error', error)); 
  }, [setLendData])
  return { lendData }
}

export const useStakeData = () => {
  const [stakeData, setStakeData] = useState([])
  useEffect(() => {
    const data = mainnet.Vaults.map((pool) => {
      const sData = async () => {
        const { name } = pool;
        const stakeValue = await getStakeValue(pool);
        const stakeAPR = await getStakeApr(pool);
        return { name, stakeValue, stakeAPR };
      };
      return sData();
    });
    Promise.all(data)
      .then((values) => {
        setStakeData(values)
      })
      .catch((error) => console.error('error', error));
  }, [setStakeData])
  return { stakeData }
}

export const loadStakeData = async () => {
  const stakedValue = mainnet.Vaults.map((pool) => {
    const loadingStakingData = async () => {
      const { name } = pool;
      const stakeValue = await getStakeValue(pool);
      const stakeAPR = await getStakeApr(pool);
      return { name, stakeValue, stakeAPR };
    };
    return loadingStakingData();
  });
  Promise.all(stakedValue)
    .then((values) => {
      // console.info('stake', values);
      return values;
    })
    .catch((error) => console.error('error', error));
}
// stake页面，card里面的balance？？
export const getpoolHuskyDaily = async () => {
  const poolHuskyDaily = mainnet.FairLaunch.pools.map((pool) => {
    const loadingHuskyDaily = async () => {
      const huskyDaily = await getPoolHuskyDaily(pool);
      return huskyDaily;
    };
    return loadingHuskyDaily();
  });
  Promise.all(poolHuskyDaily)
    .then((values) => {
      // console.info('poolHuskyDaily', values);
      return values;
    })
    .catch((error) => console.error('error', error));
}

export const getStakeData = () => {
  const stakedata = loadStakeData()
  
  const stakedata1 = getpoolHuskyDaily()

  // console.info(stakedata);console.info(stakedata1);

  return stakedata;
}



export const usesumLendingPoolData = async () => {
  const tokenData = mainnet.Vaults.map((pool) => {
    const totalTokenData = async () => {
      const totalToken = await getSumLendData(pool);
      return totalToken;
    };
    return totalTokenData();
  });
  Promise.all(tokenData)
    .then((values) => {
      // sumTokenData(values)
      return sumTokenData(values)
    })
    .catch((error) => console.error('error', error));

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

export const usePriceBnbBusd = (): BigNumber => {
  const bnbBusdFarm = useFarmFromPid(252)
  return new BigNumber(bnbBusdFarm.quoteToken.busdPrice)
}

export const usePriceCakeBusd = (): BigNumber => {
  const cakeBnbFarm = useFarmFromPid(251)

  const cakePriceBusdAsString = cakeBnbFarm.token.busdPrice
  const cakePriceBusd = useMemo(() => {
    return new BigNumber(cakePriceBusdAsString)
  }, [cakePriceBusdAsString])
  return cakePriceBusd
}
