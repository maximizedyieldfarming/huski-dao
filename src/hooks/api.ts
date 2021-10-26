import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'

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

export const useGetPositions = () => {
  const [data, setData] = useState(null)
  const { account } = useWeb3React()
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        const env = process.env.REACT_APP_ENV;
        switch (env) {
          case 'dev':
            response = `https://api.alpacafinance.org/v2/positions?owner=${account}&limit=10&offset=0`;
            break;
          case 'test':
            response = `https://api.huski.finance/api/v1/positions/get?owner=${account}`;
            break;
          case 'prod':
          default:
            response = `https://api.alpacafinance.org/v2/positions?owner=${account}&limit=10&offset=0`;
            break;
        }

        // const response = `https://api.alpacafinance.org/v2/positions?owner=${account}&limit=10&offset=0`;
        const res = await fetch(response);
        const responseData = await res.json();
        
        setData(responseData.data.positions)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [account, setData])

  return data
}