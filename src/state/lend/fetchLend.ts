import { LendConfig } from 'config/constants/types'
import { LendFarm } from 'state/types'
import fetchPublicFarmData from "./fetchPublicLendData"

const fetchFarm = async (farm: LendFarm): Promise<LendFarm> => {
  const farmPublicData = await fetchPublicFarmData(farm)

  return { ...farm, ...farmPublicData }
}

const fetchFarms = async (farmsToFetch: LendConfig[]) => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const farm = await fetchFarm(farmConfig)
      return farm
    }),
  )
  return data
}

export default fetchFarms
