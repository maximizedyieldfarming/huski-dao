import { StakeConfig } from 'config/constants/types'
import { Stake } from 'state/types'
import fetchPublicFarmData from './fetchPublicStakeData'

const fetchStake = async (stake: Stake): Promise<Stake> => {
  const farmPublicData = await fetchPublicFarmData(stake)

  return { ...stake, ...farmPublicData }
}

const fetchStakes = async (farmsToFetch: StakeConfig[]) => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const stake = await fetchStake(farmConfig)
      return stake
    }),
  )
  return data
}

export default fetchStakes
