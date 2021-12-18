import { useEffect, useState } from 'react'
import useRefresh from 'hooks/useRefresh'
import request, { gql } from 'graphql-request'
import { VOLUME_24H } from 'config/constants/endpoints'
import moment from 'moment'

export const getPairDayDatasfunc = async (date) => {

  const response = await request(
    VOLUME_24H,
    gql`
      query getVolume($date: BigInt) {
        vaultDayDatas(
        first:10
        where: {  date: $date }
      ) {
        id
        dailyBorrowingInterestMean
      }
      }
    `,
    { date },
  )

  return response.vaultDayDatas
}

export const useBorrowingInterest7days = async () => {
  const [borrowingInterest7day, setBorrowingInterest7day] = useState(0)

  useEffect(() => {
    const fetchTradingFee = async () => {

      try {
        // const date = moment().format('YYYY-MM-DD 00:00:00');
        const date = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
        const timestamp = moment(date).unix()
        console.info('date ', timestamp)

        const response = await getPairDayDatasfunc(timestamp)
        console.info(response)
        const { dailyBorrowingInterestMean } = response
        const dailyBorrowingInterest = (dailyBorrowingInterestMean || 0) * 86400 / (10 ** 18)
        setBorrowingInterest7day(dailyBorrowingInterest)

      } catch (error) {
        console.error('Unable to fetch data form gql:', error)
      }



    }

    fetchTradingFee()
  }, [])

  console.info('borrowingInterest7day', borrowingInterest7day)
  return borrowingInterest7day
}


export default useBorrowingInterest7days
