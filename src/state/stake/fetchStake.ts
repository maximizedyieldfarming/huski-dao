import { StakeConfig } from 'config/constants/types'
import { Stake } from 'state/types'
import fetchPublicFarmData from './fetchPublicStakeData'

const fetchStake = async (farm: Stake): Promise<Stake> => {
  const farmPublicData = await fetchPublicFarmData(farm)

  return { ...farm, ...farmPublicData }
}

const fetchStakes = async (farmsToFetch: StakeConfig[]) => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const farm = await fetchStake(farmConfig)
      return farm
    }),
  )
  return data
}

export default fetchStakes
