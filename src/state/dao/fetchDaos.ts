import { DaoConfig } from 'config/constants/types'
import { Dao } from 'state/types'
import fetchPublicDaoData from './fetchPublicDaoData'

const fetchDao = async (dao: Dao): Promise<Dao> => {
  const farmPublicData = await fetchPublicDaoData(dao)

  return { ...dao, ...farmPublicData }
}

const fetchDaos = async (farmsToFetch: DaoConfig[]) => {
  const data = await Promise.all(
    farmsToFetch.map(async (daoConfig) => {
      const dao = await fetchDao(daoConfig)
      return dao
    }),
  )
  return data
}

export default fetchDaos
