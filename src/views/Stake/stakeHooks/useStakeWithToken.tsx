import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import { getHuskiAddress } from 'utils/addressHelpers'
import huskyTokenABI from 'config/abi/huskyToken.json'
import useRefresh from 'hooks/useRefresh'
import { getBalanceAmount } from 'utils/formatBalance'


export const useStakeWithToken = () => {
  const { account } = useWeb3React()
  useEffect(() => {
    const fetchStakeLockData = async () => {
      const [lockOf, canUnlockAmount] =
        await multicall(huskyTokenABI, [
          {
            address: getHuskiAddress(),
            name: 'lockOf',
            params: [account],
          },
          {
            address: getHuskiAddress(),
            name: 'canUnlockAmount',
            params: [account],
          }
        ])

      console.info('lockOf', lockOf);
      console.info('canUnlockAmount', canUnlockAmount);
    }
    if (account) {
      fetchStakeLockData()
    }


  }, [account])

  return {}
}

export default useStakeWithToken
