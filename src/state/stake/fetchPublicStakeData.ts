import BigNumber from 'bignumber.js'
import VaultABI from 'config/abi/vault.json'
import fairLaunchABI from 'config/abi/fairLaunch.json'
import { getAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getFairLaunch } from 'utils/env'
import multicall from 'utils/multicall'
import { Stake, SerializedBigNumber } from '../types'

type PublicFarmData = {
  totalSupply: SerializedBigNumber
  totalToken: SerializedBigNumber
  vaultDebtVal: SerializedBigNumber
  poolWeight: SerializedBigNumber
  pooPerBlock: number
}

const fetchStake = async (stake: Stake): Promise<PublicFarmData> => {
  const { pid, vaultAddress, token } = stake
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

  const [info, alpacaPerBlock, totalAllocPoint] =
    pid || pid === 0
      ? await multicall(fairLaunchABI, [
        {
          address: getFairLaunch(),
          name: 'poolInfo',
          params: [pid],
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
    pooPerBlock,
  }
}

export default fetchStake
