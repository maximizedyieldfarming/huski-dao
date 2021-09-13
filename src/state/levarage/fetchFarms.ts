import { LevarageFarmConfig } from 'config/constants/types'
import { LevarageFarm } from 'state/types'
import fetchPublicFarmData from './fetchPublicFarmData'

const fetchFarm = async (farm: LevarageFarm): Promise<LevarageFarm> => {
  const farmPublicData = await fetchPublicFarmData(farm)

  return { ...farm, ...farmPublicData }
}

const fetchFarms = async (farmsToFetch: LevarageFarmConfig[]) => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const farm = await fetchFarm(farmConfig)
      return farm
    }),
  )
  return data
}

export default fetchFarms
