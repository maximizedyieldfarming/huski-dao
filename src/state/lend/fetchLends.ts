import { FarmConfig } from 'config/constants/types'
import fetchLend from './fetchLend'

const fetchLends = async (lendsToFetch: FarmConfig[]) => {
  const data = await Promise.all(
    lendsToFetch.map(async (lendConfig) => {
      const lend = await fetchLend(lendConfig)
      return lend
    }),
  )
  return data
}

export default fetchLends
