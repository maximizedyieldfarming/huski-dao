import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { DaoConfig } from 'config/constants/types'

export const fetchFarmUserAllowances = async (account: string, daoToFetch: DaoConfig[]) => {

  const calls = daoToFetch.map((dao) => {
    const baseTokenAddress = getAddress(dao.token.address)
    return { address: baseTokenAddress, name: 'allowance', params: [account, dao.vaultAddress] }
  })

  const vaultAllowances = await multicall(erc20ABI, calls)
  const allowance = vaultAllowances.map((value) => {
    return new BigNumber(value).toJSON()
  })
  return allowance
}
