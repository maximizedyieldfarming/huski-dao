/* eslint-disable array-callback-return */
import { useEffect, useState } from 'react'
import useRefresh from 'hooks/useRefresh'
import request, { gql } from 'graphql-request'
import { VOLUME_24H } from 'config/constants/endpoints'
import moment from 'moment'

export const getVolume = async (date) => {

  const response = await request(
    VOLUME_24H,
    gql`
      query getVolume($date: BigInt) {
        vaultDayDatas(
        first:10
        where: {  date: $date }
      ) {
        id
        dailyBaseTokenTVL
      }
      }
    `,
    { date },
  )

  return response.vaultDayDatas
}

export const useVolume24h = () => {
  const [volume24hnum, setVolumenum] = useState<number>(0)

  useEffect(() => {
    const fetchVolumenum = async () => {

      try {
        // const date = moment().format('YYYY-MM-DD 00:00:00');
        const date = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
        const timestamp = moment(date).unix()
        console.info('date ', timestamp)
        const response = await getVolume(timestamp)

        let volumenum = 0;
        if (response.length !== 0) {

          response.map((lend) => {
            const volume: number = lend.dailyBaseTokenTVL / (10 ** 18)
            volumenum += volume
          })

        }
        console.info('volumenum', volumenum)
        setVolumenum(Number(volumenum))

      } catch (error) {
        console.error('Unable to fetch data form gql:', error)
      }

    }

    fetchVolumenum()
  }, [volume24hnum])


  return volume24hnum
}


export default useVolume24h
