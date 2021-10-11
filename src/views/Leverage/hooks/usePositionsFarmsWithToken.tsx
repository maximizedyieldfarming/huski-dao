import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import VaultABI from 'config/abi/vault.json'
import { getMasterChefAddress } from 'utils/addressHelpers'
import masterChefABI from 'config/abi/masterchef.json'
import { farmsConfig } from 'config/constants'
import { FarmConfig } from 'config/constants/types'
import useRefresh from 'hooks/useRefresh'
import { DEFAULT_TOKEN_DECIMAL } from 'config'

export interface FarmWithBalance extends FarmConfig {
  balance: BigNumber
}

const useFarmsWithToken = (vaultAddress) => {
  const [farmsWithStakedBalance, setFarmsWithStakedBalance] = useState()
  const { account } = useWeb3React()

  useEffect(() => {
    const fetchBalances = async () => {


      const [name] =
      await multicall(VaultABI, [
        {
          address: vaultAddress,
          name: 'name',
        }
      ])

console.info('aaaa',name);

      // setFarmsWithStakedBalance(farmsWithBalances)
      // setEarningsSum(totalEarned)
    }

    if (account) {
      fetchBalances()
    }
  }, [account, vaultAddress])

  return { farmsWithStakedBalance }
}

export default useFarmsWithToken
