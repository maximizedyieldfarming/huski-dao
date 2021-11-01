import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { leverageFarmsConfig } from 'config/constants'
import useRefresh from 'hooks/useRefresh'
import { fetchLeverageFarmsPublicDataAsync, fetchLeverageFarmUserDataAsync, nonArchivedFarms } from '.'
import { State, LeverageFarm, LeverageFarmsState } from '../types'

export const usePollLeverageFarmsPublicData = (includeArchive = true) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const farmsToFetch = includeArchive ? leverageFarmsConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchLeverageFarmsPublicDataAsync(pids))
    // fetchLeverageFarmsPublicDataAsync(pids)
  }, [includeArchive, dispatch, slowRefresh])
}

export const usePollLeverageFarmsWithUserData = (includeArchive = true) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()
  // console.log("leverage: ", "usePollLeverageFarmsWithUserData")

  useEffect(() => {
    const farmsToFetch = includeArchive ? leverageFarmsConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchLeverageFarmsPublicDataAsync(pids))
    // fetchLeverageFarmsPublicDataAsync(pids)
    // console.log("leverage account: ", account)

    if (account) {
      dispatch(fetchLeverageFarmUserDataAsync({ account, pids }))
      // fetchLeverageFarmUserDataAsync({ account, pids })
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
  // console.log("leverage: ", "usePollCoreLeverageFarmData")

  useEffect(() => {
    dispatch(fetchLeverageFarmsPublicDataAsync([251, 252]))
  }, [dispatch, fastRefresh])
}

export const useLeverageFarms = (): LeverageFarmsState => {
  const farms = useSelector((state: State) => state.leverage)
  return farms
}

export const useLends = (): LeverageFarmsState => {
  const farms = useSelector((state: State) => state.leverage)

  
  return farms
}

export const useFarmFromPid = (pid): LeverageFarm => {
  const farm = useSelector((state: State) => state.leverage.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromLpSymbol = (lpSymbol: string): LeverageFarm => {
  const farm = useSelector((state: State) => state.leverage.data.find((f) => f.lpSymbol === lpSymbol))
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

export const useHuskyPrice = (): BigNumber => {
  const huskyFarm = useFarmFromPid(362)
  const huskyPriceAsString = huskyFarm.token.busdPrice
  const huskyPrice = useMemo(() => {
    return new BigNumber(huskyPriceAsString)
  }, [huskyPriceAsString])

  return huskyPrice
}

export const useCakePrice = (): BigNumber => {
  const cakeFarm = useFarmFromPid(251)
  const cakePriceAsString = cakeFarm.quoteToken.busdPrice

  const cakePrice = useMemo(() => {
    return new BigNumber(cakePriceAsString)
  }, [cakePriceAsString])

  return cakePrice
}

export const useHuskyPerBlock = (): number => {
  const huskyFarm = useFarmFromPid(362)
  const huskyPerBlock = huskyFarm.pooPerBlock
  return huskyPerBlock
}

