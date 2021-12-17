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

export const useVolume24h = async (date1) => {
  const [volume24hnum, setVolumenum] = useState(0)
  const date = moment().format('YYYY-MM-DD 00:00:00');
  // const date = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
  const startDate = moment(date).unix().toString()
  console.info('date ', startDate)
  console.info('date ', date)
  // const date1 ='1638748800'
  // 16396 70400

  useEffect(() => {
    const fetchVolumenum = async () => {
      const response = await getVolume(startDate)

      let volumenum = 0;
      response.map((lend) => {
        const volume = lend.dailyBaseTokenTVL / (10 ** 18)
        volumenum += volume

      })
      console.info('volumenum', volumenum)
      setVolumenum(volumenum)
    }

    fetchVolumenum()
  }, [date, date1, startDate])


  return volume24hnum
}


export default useVolume24h
