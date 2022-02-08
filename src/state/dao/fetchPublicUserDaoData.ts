import { getAddress } from 'utils/addressHelpers'
import { getBep20Contract } from 'utils/contractHelpers';
import BigNumber from 'bignumber.js'
import { Dao } from '../types'

type PublicDaoData = {
  allowance: string
}

const fetchUserDao = async (account: string, dao: Dao): Promise<PublicDaoData> => {
  const { vaultAddress, token, name } = dao

  let allowanceJson = '1'

  if (name === 'ETH') {
    allowanceJson = '1'
  } else {
    const vaultAddresses = getAddress(vaultAddress)
    const baseTokenAddress = getAddress(token.address)
    const contract = getBep20Contract(baseTokenAddress)
    const allowance = await contract.allowance(account, vaultAddresses)
    allowanceJson = new BigNumber(allowance?._hex).toJSON()
  }

  return {
    allowance: allowanceJson
  }
}

export default fetchUserDao
