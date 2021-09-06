import { useEffect, useMemo, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import {  getStakeValue, getStakeApr } from 'utils/vaultService'
import useRefresh from 'hooks/useRefresh'
import { getPoolHuskyDaily } from 'utils/fairLaunchService'
import mainnet from '../../mainnet.json'


// use this
export const useStakeData = () => {
  const [stakeData, setStakeData] = useState([])
  useEffect(() => {
    const data = mainnet.Vaults.map((pool) => {
      const sData = async () => {
        const { name } = pool;
        const stakeValue = await getStakeValue(pool);
        const stakeAPR = await getStakeApr(pool);
        return { name, stakeValue, stakeAPR };
      };
      return sData();
    });
    Promise.all(data)
      .then((values) => {
        setStakeData(values)
      })
      .catch((error) => console.error('error', error));
  }, [setStakeData])
  return { stakeData }
}

export const useStakeBalanceData = () => {
  const [stakeBalanceData, setStakeBalanceData] = useState([])
  useEffect(() => {
    const data = mainnet.FairLaunch.pools.map((pool) => {
      const sData = async () => {
        const huskyDaily = await getPoolHuskyDaily(pool);
        return huskyDaily;
      };
      return sData();
    });
    Promise.all(data)
      .then((values) => {
        setStakeBalanceData(values)
      })
      .catch((error) => console.error('error', error));
  }, [setStakeBalanceData])
  return { stakeBalanceData }
}

