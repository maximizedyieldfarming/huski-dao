import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import ConfigurableInterestVaultConfigABI from 'config/abi/ConfigurableInterestVaultConfig.json'
import useRefresh from 'hooks/useRefresh'
import { getBalanceAmount } from 'utils/formatBalance'


const useStakeWithToken = () => {
  const { account } = useWeb3React()
  useEffect(() => {
    const fetchStakeLockData = async () => {
      const alpacaAddress = '0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F'
      const [lockOf, canUnlockAmount] =
        await multicall(ConfigurableInterestVaultConfigABI, [
          {
            address: alpacaAddress,
            name: 'lockOf',
            params: [account],
          },
          {
            address: alpacaAddress,
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
