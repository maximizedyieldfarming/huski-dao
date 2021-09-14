import { useEffect, useMemo, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { getPoolInfo, getSumLendData } from 'utils/vaultService'
import { getBep20Contract, getCakeContract } from 'utils/contractHelpers'
import { getCakeAddress } from 'utils/addressHelpers'
import useRefresh from 'hooks/useRefresh'
import mainnet from '../../mainnet.json'
import { sumTokenData, formatBigNumber } from '../utils'

// use this
export const useLendData = () => {
  const [lendData, setLendData] = useState([])

//   const { account } = useWeb3React()
//   console.info('account',account);
//   const contract = getBep20Contract(getCakeAddress())
//   const res123 =  contract.balanceOf(account)
//  const bb = new BigNumber(res123.toString());
// console.info('bbbbbbbb',bb);



  useEffect(() => {
    const lendingData = mainnet.Vaults.map((pool) => {
      const loadLendingData = async () => {
        const dataPool = await getPoolInfo(pool);
        dataPool.name = dataPool.name.replace('Interest Bearing ', '');
        dataPool.totalDeposit = formatBigNumber(dataPool.totalDeposit);
        dataPool.totalBorrowed = formatBigNumber(dataPool.totalBorrowed);
        return dataPool;
      };
      return loadLendingData();
    });

    Promise.all(lendingData)
      .then((values) => {
        setLendData(values)
      })
      .catch((error) => console.error('error', error));
  }, [setLendData])
  return { lendData }
}

export const useLendTotalSupply = () => {
  const [lendTotalSupply, setLendTotalSupply] = useState('')
  useEffect(() => {
    const lendTSData = mainnet.Vaults.map((pool) => {
      const lendTS = async () => {
        const totalToken = await getSumLendData(pool);
        return totalToken;
      };
      return lendTS();
    });
    Promise.all(lendTSData)
      .then((values) => {
        const returndata = sumTokenData(values)
        setLendTotalSupply(returndata)
      })
      .catch((error) => console.error('error', error));
  }, [setLendTotalSupply])
  return lendTotalSupply
}


// export const useGetBnbBalance = () => {
//   // const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED)
//   // const [balance, setBalance] = useState(BIG_ZERO)
//   const { account } = useWeb3React()
//   // const { lastUpdated, setLastUpdated } = useLastUpdated()

//   useEffect(() => {
//     const fetchBalance = async () => {
//       try {
//         const walletBalance = await simpleRpcProvider.getBalance(account)
//         // setBalance(new BigNumber(walletBalance.toString()))
//         // setFetchStatus(FetchStatus.SUCCESS)
//       } catch {
//         // setFetchStatus(FetchStatus.FAILED)
//       }
//     }

//     if (account) {
//       fetchBalance()
//     }
//   }, [account, lastUpdated, setBalance, setFetchStatus])

//   return { balance, fetchStatus, refresh: setLastUpdated }
// }