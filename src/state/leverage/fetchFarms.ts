import { LeverageFarmConfig } from 'config/constants/types'
import { LeverageFarm } from 'state/types'
import fetchPublicFarmData from './fetchPublicFarmData'

const fetchFarm = async (farm: LeverageFarm): Promise<LeverageFarm> => {
  const farmPublicData = await fetchPublicFarmData(farm)

  return { ...farm, ...farmPublicData }
}

const fetchFarms = async (farmsToFetch: LeverageFarmConfig[]) => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const farm = await fetchFarm(farmConfig)
      return farm
    }),
  )
  return data
}

export default fetchFarms
