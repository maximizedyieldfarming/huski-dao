import { useEffect, useMemo, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import { daoConfig } from 'config/constants'
import useRefresh from 'hooks/useRefresh'
import { getPoolInfo, getPoolInfo33 } from 'utils/service'
import { fetchDaoPublicDataAsync, fetchDaoUserDataAsync, nonArchivedFarms } from '.'
import { State, DaoState } from '../types'


export const usePoolDaoPublicData = (includeArchive = true) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const farmsToFetch = includeArchive ? daoConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchDaoPublicDataAsync(pids))
  }, [includeArchive, dispatch, slowRefresh])
}

export const usePoolDaoWithUserData = (includeArchive = true) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const farmsToFetch = includeArchive ? daoConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchDaoPublicDataAsync(pids))

    if (account) {
      dispatch(fetchDaoUserDataAsync({ account, pids }))
    }
  }, [includeArchive, dispatch, slowRefresh, account])
}

export const usePoolCoreDaoPublicData = () => {
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchDaoPublicDataAsync([251, 252]))
  }, [dispatch, fastRefresh])
}

export const useDaos = (): DaoState => {
  const farms = useSelector((state: State) => state.dao)
  return farms
}


// export const loadBloackchainData =  () => {

//   const lendingData = mainnet.Vaults.map((pool) => {
//     const loadLendingData = async () => {
//       const dataPool = await getPoolInfo(pool);
//       dataPool.name = dataPool.name.replace('Interest Bearing ', '');
//       return dataPool;
//     };
//     return loadLendingData();
//   });
//   Promise.all(lendingData)
//     .then((values) => {
//       console.info(values);
//       return values;
//     })
//     .catch((error) => console.error('error', error));    

//   // const loadLendingData = async () => {
//   //     const dataPool = await getPoolInfo1(mainnet.Vaults);
//   //     console.info('datapool',dataPool);
//   //     return dataPool;
//   //   };
//   //   return loadLendingData();

// }


// use this  --no
export const useLendData = () => {
  const [lendData, setLendData] = useState([])
  useEffect(() => {
    const lendingData = daoConfig.map((pool) => {
      const loadLendingData = async () => {
        const dataPool = await getPoolInfo33(pool);
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

// export const useStakeData = () => {
//   const [stakeData, setStakeData] = useState([])
//   useEffect(() => {
//     const data = mainnet.Vaults.map((pool) => {
//       const sData = async () => {
//         const { name } = pool;
//         const stakeValue = await getStakeValue(pool);
//         const stakeAPR = await getStakeApr(pool);
//         return { name, stakeValue, stakeAPR };
//       };
//       return sData();
//     });
//     Promise.all(data)
//       .then((values) => {
//         setStakeData(values)
//       })
//       .catch((error) => console.error('error', error));
//   }, [setStakeData])
//   return { stakeData }
// }



// export const usesumLendingPoolData = async () => {
//   const tokenData = mainnet.Vaults.map((pool) => {
//     const totalTokenData = async () => {
//       const totalToken = await getSumLendData(pool);
//       return totalToken;
//     };
//     return totalTokenData();
//   });
//   Promise.all(tokenData)
//     .then((values) => {
//       // sumTokenData(values)
//       return sumTokenData(values)
//     })
//     .catch((error) => console.error('error', error));
// }
