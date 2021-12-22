import { useEffect, useState } from 'react'
import { getAddress } from 'utils/addressHelpers'
import useRefresh from 'hooks/useRefresh'
import request, { gql } from 'graphql-request'
import { TRADING_FEE_URL } from 'config/constants/endpoints'

export const getTradingfeesfunc = async (pairAddress) => {

  const response = await request(
    TRADING_FEE_URL,
    gql`
      query getTradingfees($pairAddress: String) {
        pairDayDatas(
        first:8
        orderBy:date
        orderDirection:desc
        where: {  pairAddress: $pairAddress }
      ) {
        id
        date
        dailyVolumeUSD
        reserveUSD
        totalSupply
      }
      }
    `,
    { pairAddress },
  )

  return response.pairDayDatas
}

export const useTradingFees = (farm) => {
  const [tradingFees, setTradingFees] = useState(0)

  const LPAddresses = getAddress(farm.lpAddresses)
  const pairAddress = LPAddresses.toLowerCase()

  useEffect(() => {
    const fetchTradingFee = async () => {
      const response = await getTradingfeesfunc(pairAddress)
      let PancakeTradingFeesAPR = 0
      if (response.length === 0) {
        PancakeTradingFeesAPR = 0
      } else {
        let totalVolumeUSD = 0
        let totalreserveUSD = 0
        let apr

        for (let i = 1; i < response.length; i++) {
          totalVolumeUSD += Number(response[i].dailyVolumeUSD)
          totalreserveUSD += Number(response[i].reserveUSD)
        }

        if (totalreserveUSD > 0) {
          apr = totalVolumeUSD * 0.17 / totalreserveUSD
          // apr = totalVolumeUSD * 365 * 0.17 / 100 / totalreserveUSD
          PancakeTradingFeesAPR = apr
        }
      }

      setTradingFees(PancakeTradingFeesAPR)
    }

    fetchTradingFee()
  }, [pairAddress])

  return { tradingFees }
}


export default useTradingFees
