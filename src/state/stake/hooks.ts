import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'
import { stakeConfig } from 'config/constants'
import { fetchStakePublicDataAsync, fetchStakeUserDataAsync, nonArchivedFarms } from '.'
import { State, Stake, StakeState } from '../types'

export const usePollLeverageFarmsPublicData = (includeArchive = true) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const farmsToFetch = includeArchive ? stakeConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchStakePublicDataAsync(pids))
  }, [includeArchive, dispatch, slowRefresh])
}

export const useStakeWithUserData = (includeArchive = true) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const farmsToFetch = includeArchive ? stakeConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchStakePublicDataAsync(pids))

    if (account) {
      dispatch(fetchStakeUserDataAsync({ account, pids }))
    }
  }, [includeArchive, dispatch, slowRefresh, account])
}

export const useStakes = (): StakeState => {
  const farms = useSelector((state: State) => state.stake)
  return farms
}

export const useFarmFromPid = (pid): Stake => {
  const farm = useSelector((state: State) => state.stake.data.find((f) => f.pid === pid))
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


export const useHuskyPrice = (): BigNumber => {
  const huskyFarm = useFarmFromPid(11)
  const huskyPriceAsString = huskyFarm.token.busdPrice
  const huskyPrice = useMemo(() => {
    return new BigNumber(huskyPriceAsString)
  }, [huskyPriceAsString])

  return huskyPrice
}