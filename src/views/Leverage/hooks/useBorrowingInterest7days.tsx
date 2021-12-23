import { useEffect, useState } from 'react'
import useRefresh from 'hooks/useRefresh'
import { getAddress } from 'utils/addressHelpers'
import request, { gql } from 'graphql-request'
import { VOLUME_24H } from 'config/constants/endpoints'
import moment from 'moment'

export const getPairDayDatasfunc = async (baseTokenAddress) => {

  const response = await request(
    VOLUME_24H,
    gql`
      query getVolume($baseTokenAddress: String) {
        vaultDayDatas(
        first:8
        where: {  baseTokenAddress: $baseTokenAddress }
      ) {
        dailyBorrowingInterestMean
      }
      }
    `,
    { baseTokenAddress },
  )

  return response.vaultDayDatas
}

export const useBorrowingInterest7days = (farm) => {
  const [borrowingInterest7day, setBorrowingInterest7day] = useState(0)

  useEffect(() => {
    const fetchTradingFee = async () => {

      try {
        // const date = moment().format('YYYY-MM-DD 00:00:00');
        // const date = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
        // const timestamp = moment(date).unix()
        console.info('date ', farm)


        const LPAddresses = getAddress(farm.lpAddresses)
        const pairAddress = LPAddresses.toLowerCase()
        const response = await getPairDayDatasfunc(pairAddress)
        console.info(response)

        for (let i = 1; i < response.length; i++) {
         
         const dailyBorrowingInterest  = response[i].dailyBorrowingInterestMean
          const dailyBorrowingInterest7days = (dailyBorrowingInterest || 0) * 86400 / (10 ** 18)

          console.info(' dailyBorrowingInterest7days', dailyBorrowingInterest7days)
        }
    

        console.info(response)
        // setBorrowingInterest7day(dailyBorrowingInterest)

      } catch (error) {
        console.error('Unable to fetch data form gql:', error)
      }



    }

    fetchTradingFee()
  }, [farm, farm.lpAddresses])

  console.info('borrowingInterest7day', borrowingInterest7day)
  return borrowingInterest7day
}


export default useBorrowingInterest7days
