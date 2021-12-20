import { useEffect, useState } from 'react'
import moment from 'moment'
import useRefresh from './useRefresh'

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
            response = `https://api.huski.finance/api/v1/positions/get?owner=${account}`;
            break;
          case 'test':
            response = `https://api.huski.finance/api/v1/positions/get?owner=${account}`;
            break;
          case 'prod':
          default:
            response = `https://api.huski.finance/api/v1/positions/get?owner=${account}`;
            break;
        }

        // const response = `https://api.alpacafinance.org/v2/positions?owner=${account}&limit=10&offset=0`;
        const res = await fetch(response);
        const responseData = await res.json();

        const returnData = responseData.data === null ? [] : responseData.data
        setData(returnData)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [account, setData])

  return data
}


export const usePriceList = (coingeckoId) => {
  const [priceList, setPriceList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const start = moment().format('YYYY-MM-DD 00:00:00');
        const end = moment().subtract(91, 'days').format('YYYY-MM-DD 00:00:00');
        const startDate = moment(start).unix()
        const endDate = moment(end).unix()

        const cakePriceCoinGeckoApi = `https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart/range?vs_currency=usd&from=${endDate}&to=${startDate}`;
        const res = await fetch(cakePriceCoinGeckoApi);
        const responseData = await res.json();

        const priceListValue = [];
        for (let i = 1; i < responseData.prices.length; i++) {
          priceListValue.push(responseData.prices[i][1])
        }

        setPriceList(priceListValue)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [coingeckoId, setPriceList])

  return priceList
}

export const useTokenPriceList = (coingeckoId) => {
  const [tokenPriceList, setTokenPriceList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const start = moment().format('YYYY-MM-DD 00:00:00');
        const end = moment().subtract(500, 'days').format('YYYY-MM-DD 00:00:00');
        const startDate = moment(start).unix()
        const endDate = moment(end).unix()

        const cakePriceCoinGeckoApi = `https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart/range?vs_currency=usd&from=${endDate}&to=${startDate}`;
        const res = await fetch(cakePriceCoinGeckoApi);
        const responseData = await res.json();

        setTokenPriceList(responseData.prices)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [coingeckoId, setTokenPriceList])

  return tokenPriceList
}


export const useCakePrice = () => {
  const [cakePrice, setCakePrice] = useState()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cakePriceCoinGeckoApi = `https://api.coingecko.com/api/v3/coins/markets?ids=pancakeswap-token&vs_currency=usd`;
        const res = await fetch(cakePriceCoinGeckoApi);
        const responseData = await res.json();
        setCakePrice(responseData[0].current_price)

      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [slowRefresh])

  return cakePrice
}

export const useHuskiPrice = () => {
  const [huskiPrice, setHuskiPrice] = useState(0)
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cakePriceCoinGeckoApi = `https://api.coingecko.com/api/v3/coins/markets?ids=alpaca-finance&vs_currency=usd`;
        const res = await fetch(cakePriceCoinGeckoApi);
        const responseData = await res.json();
        // setHuskiPrice(responseData[0].current_price)
        setHuskiPrice(0)

      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [slowRefresh])

  return huskiPrice
}