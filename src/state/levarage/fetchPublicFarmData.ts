import BigNumber from 'bignumber.js'
import masterchefABI from 'config/abi/masterchef.json'
import lpTokenABI from 'config/abi/lpToken.json'
import VaultABI from 'config/abi/vault.json'
import fairLaunchABI from 'config/abi/fairLaunch.json'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getFairLaunch } from 'utils/env'
import multicall from 'utils/multicall'
import { LevarageFarm, SerializedBigNumber } from '../types'

type PublicFarmData = {
  totalSupply: SerializedBigNumber
  totalToken: SerializedBigNumber
  vaultDebtVal: SerializedBigNumber
  tokenReserve: SerializedBigNumber
  quoteTokenReserve: SerializedBigNumber
  poolWeight: SerializedBigNumber
  multiplier: string
}

const fetchFarm = async (farm: LevarageFarm): Promise<PublicFarmData> => {
  const { poolId, lpAddresses, token, quoteToken, vaultAddress } = farm
  const lpAddress = getAddress(lpAddresses)
  const vaultAddresses = getAddress(vaultAddress)
  const calls = [
    {
      address: lpAddress,
      name: 'getReserves',
    },
  ]

  const [lpTotalReserves] =
    await multicall(lpTokenABI, calls)
  const [totalSupply, totalToken, vaultDebtVal] =
    await multicall(VaultABI, [
      {
        address: vaultAddresses,
        name: 'totalSupply',
      },
      {
        address: vaultAddresses,
        name: 'totalToken',
      },
      {
        address: vaultAddresses,
        name: 'vaultDebtVal',
      },
    ])

  // Only make masterchef calls if farm has pid
  const [info, totalAllocPoint] =
  poolId || poolId === 0
      ? await multicall(fairLaunchABI, [
          {
            address: getFairLaunch(),
            name: 'poolInfo',
            params: [poolId],
          },
          {
            address: getFairLaunch(),
            name: 'totalAllocPoint',
          },
        ])
      : [null, null]

  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
  const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO

  return {
    totalSupply: totalSupply[0]._hex,
    totalToken: totalToken[0]._hex,
    vaultDebtVal: vaultDebtVal[0]._hex,
    tokenReserve: lpTotalReserves._reserve0.toJSON(),
    quoteTokenReserve: lpTotalReserves._reserve1.toJSON(),
    poolWeight: poolWeight.toJSON(),
    multiplier: `${allocPoint.div(100).toString()}XqQ`,
  }
}

export default fetchFarm
