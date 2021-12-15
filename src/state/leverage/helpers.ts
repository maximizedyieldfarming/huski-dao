import request, { gql } from 'graphql-request'
import { TRADING_FEE_URL , GRAPH_API_PREDICTION} from 'config/constants/endpoints'
import { LeverageFarmConfig } from 'config/constants/types'

export const getTradingfees = async (first = 7 , farmsToFetch: LeverageFarmConfig[]) => {
  // const aaa = '0xffd1b713ecf9ea32f0749a10116b81b861269d8b'
  // console.info('zaizheli---',TRADING_FEE_URL)

  // const { market } = (await request(
  //   GRAPH_API_PREDICTION,
  //   gql`
  //     query getTotalWonData {
  //       market(id: 1) {
  //         totalBNB
  //         totalBNBTreasury
  //       }
  //     }
  //   `,
  // ))
  // console.info('market',market)
  const response = await request(
    TRADING_FEE_URL,
    gql`
      query getTradingfees($first: Int!) {
        pairDayDatas(
        first:$first
        orderBy:date
        orderDirection:desc
      ) {
        id
        date
        dailyVolumeUSD
        reserveUSD
        totalSupply
        pairAddress {
        name
        }
      }
      }
    `,
    { first },
  )

  console.info('response',response)
  return response.pairDayDatas
}


