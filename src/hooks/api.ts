import { useEffect, useState } from 'react'
import VaultABI from 'config/abi/vault.json'
import WorkerABI from 'config/abi/PancakeswapV2Worker.json'
import { getAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'
import { useWeb3React } from '@web3-react/core'

/* eslint-disable camelcase */
export interface PositionsResponse {
  id: string
  chain: string
  name: string
  site_url: string
  logo_url: string
  has_supported_portfolio: boolean
  tvl: number
}

//  const [data, setData] = useState<DeBankTvlResponse | null>(null)
//  const responseData: DeBankTvlResponse = await response.json()

export const useGetPositions = (account) => {
  const [data, setData] = useState([])
  // const { account } = useWeb3React()
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
            response = `https://api.huski.finance/api/v1/positions/get?owner=${account}`;
            // response = `https://api.alpacafinance.org/v2/positions?owner=${account}&limit=10&offset=0`;
            break;
        }

        // const response = `https://api.alpacafinance.org/v2/positions?owner=${account}&limit=10&offset=0`;
        const res = await fetch(response);
        const responseData = await res.json();
  
        const returnData = responseData.data === null ?  []: responseData.data 
        setData(returnData)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [account, setData])

  return data
}