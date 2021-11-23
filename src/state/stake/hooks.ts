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
  const stake = useSelector((state: State) => state.stake.data.find((f) => f.pid === pid))
  return stake
}

export const useFarmUser = (pid) => {
  const stake = useFarmFromPid(pid)

  return {
    allowance: stake.userData ? new BigNumber(stake.userData.allowance) : BIG_ZERO,
    tokenBalance: stake.userData ? new BigNumber(stake.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: stake.userData ? new BigNumber(stake.userData.stakedBalance) : BIG_ZERO,
    earnings: stake.userData ? new BigNumber(stake.userData.earnings) : BIG_ZERO,
  }
}


export const useHuskyPrice = (): BigNumber => {
  const huskiConfig = stakeConfig.find((item) => item.name === 'HUSKI')
  const huskyFarm = useFarmFromPid(huskiConfig.pid)
  const huskyPriceAsString = huskyFarm.token.busdPrice
  const huskyPrice = useMemo(() => {
    return new BigNumber(huskyPriceAsString)
  }, [huskyPriceAsString])

  return huskyPrice
}