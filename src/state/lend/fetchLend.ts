import { Farm } from 'state/types'
import fetchPublicLendData from './fetchPublicLendData'

const fetchLend = async (lend: Farm): Promise<Farm> => {
  const lendPublicData = await fetchPublicLendData(lend)

  return { ...lend, ...lendPublicData }
}

export default fetchLend
