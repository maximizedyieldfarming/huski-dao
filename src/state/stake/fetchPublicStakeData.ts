import BigNumber from 'bignumber.js'
import masterchefABI from 'config/abi/masterchef.json'
import lpTokenABI from 'config/abi/lpToken.json'
import VaultABI from 'config/abi/vault.json'
import fairLaunchABI from 'config/abi/fairLaunch.json'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getFairLaunch } from 'utils/env'
import multicall from 'utils/multicall'
import { Stake, SerializedBigNumber } from '../types'

type PublicFarmData = {
  totalSupply: SerializedBigNumber
  totalToken: SerializedBigNumber
  vaultDebtVal: SerializedBigNumber
  poolWeight: SerializedBigNumber
  multiplier: string
  pooPerBlock: number
}

const fetchStake = async (farm: Stake): Promise<PublicFarmData> => {
  const { poolId, vaultAddress } = farm
  const vaultAddresses = getAddress(vaultAddress)
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
  const [info, alpacaPerBlock, totalAllocPoint] =
  poolId || poolId === 0
      ? await multicall(fairLaunchABI, [
          {
            address: getFairLaunch(),
            name: 'poolInfo',
            params: [poolId],
          },
          {
            address: getFairLaunch(),
            name: 'alpacaPerBlock',
          },
          {
            address: getFairLaunch(),
            name: 'totalAllocPoint',
          },
        ])
      : [null, null]

  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
  const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO
  const pooPerBlock = alpacaPerBlock * info.allocPoint / totalAllocPoint;

  return {
    totalSupply: totalSupply[0]._hex,
    totalToken: totalToken[0]._hex,
    vaultDebtVal: vaultDebtVal[0]._hex,
    poolWeight: poolWeight.toJSON(),
    multiplier: `${allocPoint.div(100).toString()}XqQ`,
    pooPerBlock,
  }
}

export default fetchStake
