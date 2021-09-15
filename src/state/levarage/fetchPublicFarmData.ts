import BigNumber from 'bignumber.js'
import masterchefABI from 'config/abi/masterchef.json'
import lpTokenABI from 'config/abi/lpToken.json'
import fairLaunchABI from 'config/abi/fairLaunch.json'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getFairLaunch } from 'utils/env'
import multicall from 'utils/multicall'
import { LevarageFarm, SerializedBigNumber } from '../types'

type PublicFarmData = {
  tokenReserve: SerializedBigNumber
  quoteTokenReserve: SerializedBigNumber
  poolWeight: SerializedBigNumber
  multiplier: string
}

const fetchFarm = async (farm: LevarageFarm): Promise<PublicFarmData> => {
  const { poolId, lpAddresses, token, quoteToken } = farm
  const lpAddress = getAddress(lpAddresses)
  const calls = [
    {
      address: lpAddress,
      name: 'getReserves',
    },
  ]
  console.log(lpAddress)

  const [lpTotalReserves] =
    await multicall(lpTokenABI, calls)

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
    tokenReserve: lpTotalReserves._reserve0.toJSON(),
    quoteTokenReserve: lpTotalReserves._reserve1.toJSON(),
    poolWeight: poolWeight.toJSON(),
    multiplier: `${allocPoint.div(100).toString()}XqQ`,
  }
}

export default fetchFarm
