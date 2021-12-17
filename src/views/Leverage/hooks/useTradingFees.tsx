import { useEffect, useState } from 'react'
import { getAddress } from 'utils/addressHelpers'
import useRefresh from 'hooks/useRefresh'
import request, { gql } from 'graphql-request'
import { TRADING_FEE_URL } from 'config/constants/endpoints'

export const getTradingfeesfunc = async ( pairAddress) => {

  const response = await request(
    TRADING_FEE_URL,
    gql`
      query getTradingfees($pairAddress: String) {
        pairDayDatas(
        first:1
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

  
  return response.pairDayDatas[0]
}

export const useTradingFees = async ( farm) => {
  const [tradingFees, setTradingFees] = useState('0')

  const LPAddresses = getAddress(farm.lpAddresses)
  const pairAddress =  LPAddresses.toLowerCase()


useEffect(() => {
  const fetchTradingFee = async () => {
    const response = await getTradingfeesfunc(pairAddress)
    setTradingFees(response.reserveUSD)
  }

  fetchTradingFee()
}, [pairAddress])

console.info('tradingFees',tradingFees)
  return tradingFees
}


export default useTradingFees
