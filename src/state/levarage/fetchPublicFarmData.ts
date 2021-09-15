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
  lendInfo: {
    name: string
    symbol: string
    totalSupply: SerializedBigNumber
    totalToken: SerializedBigNumber,
    vaultDebtVal: SerializedBigNumber
  }
  tokenReserve: SerializedBigNumber
  quoteTokenReserve: SerializedBigNumber
  poolWeight: SerializedBigNumber
  multiplier: string
}

const fetchFarm = async (farm: LevarageFarm): Promise<PublicFarmData> => {
  const { poolId, lpAddresses, token, quoteToken, vaultAddress } = farm
  const lpAddress = getAddress(lpAddresses)
  const lpAddress1 = getAddress(vaultAddress)
  const calls = [
    {
      address: lpAddress,
      name: 'getReserves',
    },
  ]

  const [lpTotalReserves] =
    await multicall(lpTokenABI, calls)
  const [name, symbol, totalSupply, totalToken, vaultDebtVal] =
    await multicall(VaultABI, [
      {
        address: lpAddress1,
        name: 'name',
      },
      {
        address: lpAddress1,
        name: 'symbol',
      },
      {
        address: lpAddress1,
        name: 'totalSupply',
      },
      {
        address: lpAddress1,
        name: 'totalToken',
      },
      {
        address: lpAddress1,
        name: 'vaultDebtVal',
      },
    ])
         
// console.log({'name---':name, symbol, totalSupply, totalToken, vaultDebtVal});
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


  const totalSupply1 = totalSupply[0]._hex
  const totalToken1 =  new BigNumber(totalToken[0]._hex)
  const vaultDebtVal1 = new BigNumber(vaultDebtVal[0]._hex)
  // console.log({'totalSupply1-1-':totalSupply1, 'name':name[0] });
//  const  lendInfo= {
//     name: name[0],
//     symbol: symbol[0],
//     totalSupply:totalSupply1,
//     totalToken: totalToken1,
//     vaultDebtVal: vaultDebtVal1
//   }
  // console.info('999000',lendInfo);
  return {
    lendInfo: {
      name: name[0],
      symbol: symbol[0],
      totalSupply:totalSupply1.toJSON(),
      totalToken: totalToken1.toJSON(),
      vaultDebtVal: vaultDebtVal1.toJSON()
    },
    tokenReserve: lpTotalReserves._reserve0.toJSON(),
    quoteTokenReserve: lpTotalReserves._reserve1.toJSON(),
    poolWeight: poolWeight.toJSON(),
    multiplier: `${allocPoint.div(100).toString()}XqQ`,
  }
}

export default fetchFarm
