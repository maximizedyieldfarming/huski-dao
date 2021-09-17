import { useEffect, useMemo, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { getPoolInfo, getSumLendData } from 'utils/vaultService'
import useRefresh from 'hooks/useRefresh'
import mainnet from '../../mainnet.json'
import { sumTokenData, formatBigNumber } from '../utils'

// use this
// export const useLendData = () => {
//   const [lendData, setLendData] = useState([])

//   useEffect(() => {
//     const lendingData = mainnet.Vaults.map((pool) => {
//       const loadLendingData = async () => {
//         const dataPool = await getPoolInfo(pool);
//         dataPool.name = dataPool.name.replace('Interest Bearing ', '');
//         dataPool.totalDeposit = formatBigNumber(dataPool.totalDeposit);
//         dataPool.totalBorrowed = formatBigNumber(dataPool.totalBorrowed);
//         return dataPool;
//       };
//       return loadLendingData();
//     });

//     Promise.all(lendingData)
//       .then((values) => {
//         setLendData(values)
//       })
//       .catch((error) => console.error('error', error));
//   }, [setLendData])
//   return { lendData }
// }

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
