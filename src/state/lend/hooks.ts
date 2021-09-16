import { useEffect, useMemo, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { getPoolInfo, getSumLendData } from 'utils/vaultService'
import { getBep20Contract, getCakeContract } from 'utils/contractHelpers'
import { getCakeAddress } from 'utils/addressHelpers'
import useRefresh from 'hooks/useRefresh'
import { lendConfig } from 'config/constants'
import mainnet from '../../mainnet.json'
import { sumTokenData, formatBigNumber } from '../utils'
import { fetchLendPublicDataAsync, fetchLendUserDataAsync, nonArchivedFarms } from '.'
import { State, LendFarm, LendState } from '../types'

// use this
export const useLendData = () => {
  const [lendData, setLendData] = useState([])

  useEffect(() => {
    const lendingData = mainnet.Vaults.map((pool) => {
      const loadLendingData = async () => {
        const dataPool = await getPoolInfo(pool);
        dataPool.name = dataPool.name.replace('Interest Bearing ', '');
        dataPool.totalDeposit = formatBigNumber(dataPool.totalDeposit);
        dataPool.totalBorrowed = formatBigNumber(dataPool.totalBorrowed);
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

export const useLendTotalSupply = () => {
  const [lendTotalSupply, setLendTotalSupply] = useState('')
  useEffect(() => {
    const lendTSData = mainnet.Vaults.map((pool) => {
      const lendTS = async () => {
        const totalToken = await getSumLendData(pool);
        return totalToken;
      };
      return lendTS();
    });
    Promise.all(lendTSData)
      .then((values) => {
        const returndata = sumTokenData(values)
        setLendTotalSupply(returndata)
      })
      .catch((error) => console.error('error', error));
  }, [setLendTotalSupply])
  return lendTotalSupply
}


export const usePollLevarageFarmsPublicData = (includeArchive = true) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const farmsToFetch = includeArchive ? lendConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchLendPublicDataAsync(pids))
    // fetchLendPublicDataAsync(pids)
  }, [includeArchive, dispatch, slowRefresh])
}

export const usePollLevarageFarmsWithUserData = (includeArchive = true) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const farmsToFetch = includeArchive ? lendConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)
    dispatch(fetchLendPublicDataAsync(pids))
    if (account) {
      dispatch(fetchLendUserDataAsync({ account, pids }))
    }
  }, [includeArchive, dispatch, slowRefresh, account])
}

/**
 * Fetches the "core" farm data used globally
 * 251 = CAKE-BNB LP
 * 252 = BUSD-BNB LP
 */
export const usePollCoreLevarageFarmData = () => {
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchLendPublicDataAsync([251, 252]))
  }, [dispatch, fastRefresh])
}

export const useLevarageFarms = (): LendState => {
  const farms = useSelector((state: State) => state.lend)
  return farms
}

export const useFarmFromPid = (pid): LendFarm => {
  const farm = useSelector((state: State) => state.lend.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromLpSymbol = (lpSymbol: string): LendFarm => {
  const farm = useSelector((state: State) => state.lend.data.find((f) => f.lpSymbol === lpSymbol))
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

