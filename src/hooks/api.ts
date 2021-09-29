import { useEffect, useState } from 'react'

/* eslint-disable camelcase */
export interface DeBankTvlResponse {
  id: string
  chain: string
  name: string
  site_url: string
  logo_url: string
  has_supported_portfolio: boolean
  tvl: number
}

export const useGetStats = () => {
  const [data, setData] = useState<DeBankTvlResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://openapi.debank.com/v1/protocol?id=bsc_pancakeswap')
        const responseData: DeBankTvlResponse = await response.json()

        setData(responseData)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}

export const useTradeFee = () => {
  const [data, setData] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.alpacafinance.org/v1/internal/tradingFee')
        const responseData = await response.json()
        console.info('jinlale--- ',responseData.data.tradingFees);
        setData(responseData.data.tradingFees)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }
    
    fetchData()
  }, [setData])

  return data
}