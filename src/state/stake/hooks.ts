import { useEffect, useMemo, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import {  getStakeValue, getStakeApr } from 'utils/vaultService'
import useRefresh from 'hooks/useRefresh'
import { getPoolHuskyDaily } from 'utils/fairLaunchService'
import { stakeConfig } from 'config/constants'
import mainnet from '../../mainnet.json'
import { formatBigNumber } from '../utils'
import { fetchStakePublicDataAsync, fetchStakeUserDataAsync, nonArchivedFarms } from '.'
import { State, Stake, StakeState } from '../types'

export const usePollLeverageFarmsPublicData = (includeArchive = true) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const farmsToFetch = includeArchive ? stakeConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchStakePublicDataAsync(pids))
    // fetchStakePublicDataAsync(pids)
  }, [includeArchive, dispatch, slowRefresh])
}

export const usePollLeverageFarmsWithUserData = (includeArchive = true) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()
  // console.log("stake999: ", "usePollLeverageFarmsWithUserData")

  useEffect(() => {
    const farmsToFetch = includeArchive ? stakeConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchStakePublicDataAsync(pids))

    if (account) {
      dispatch(fetchStakeUserDataAsync({ account, pids }))
    }
  }, [includeArchive, dispatch, slowRefresh, account])
}

/**
 * Fetches the "core" farm data used globally
 * 251 = CAKE-BNB LP
 * 252 = BUSD-BNB LP
 */
export const usePollCoreLeverageFarmData = () => {
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchStakePublicDataAsync([251, 252]))
  }, [dispatch, fastRefresh])
}

export const useStakes = (): StakeState => {
  const farms = useSelector((state: State) => state.stake)
  return farms
}

export const useLends = (): StakeState => {
  const farms = useSelector((state: State) => state.stake)
  return farms
}

export const useFarmFromPid = (pid): Stake => {
  const farm = useSelector((state: State) => state.stake.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromLpSymbol = (lpSymbol: string): Stake => {
  const farm = useSelector((state: State) => state.stake.data.find((f) => f.lpSymbol === lpSymbol))
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

// use this
export const useStakeData = () => {
  const [stakeData, setStakeData] = useState([])
  useEffect(() => {
    const data = mainnet.Vaults.map((pool) => {
      const sData = async () => {
        const name = pool.name.replace('Interest Bearing ', '');
        let stakeValue:any = await getStakeValue(pool);
        stakeValue = formatBigNumber(stakeValue);
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

export const useStakeBalanceData = () => {
  const [stakeBalanceData, setStakeBalanceData] = useState([])
  useEffect(() => {
    const data = mainnet.FairLaunch.pools.map((pool) => {
      const sData = async () => {
        const huskyDaily = await getPoolHuskyDaily(pool.id);
        return huskyDaily;
      };
      return sData();
    });
    Promise.all(data)
      .then((values) => {
        setStakeBalanceData(values)
      })
      .catch((error) => console.error('error', error));
  }, [setStakeBalanceData])
  return { stakeBalanceData }
}

