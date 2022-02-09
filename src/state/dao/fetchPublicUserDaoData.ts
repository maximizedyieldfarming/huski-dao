import { getAddress } from 'utils/addressHelpers'
import { getBep20Contract, getConfigContract } from 'utils/contractHelpers';
import BigNumber from 'bignumber.js'
import { Dao } from '../types'

type PublicDaoData = {
  allowance: string
  investorStatus: boolean
}

const fetchUserDao = async (account: string, dao: Dao): Promise<PublicDaoData> => {
  const { vaultAddress, token, name, configAddress } = dao

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

  const configAddresses = getAddress(configAddress)
  const config = getConfigContract(configAddresses);
  const getInvestorStatus = await config.getInvestorStatus(account);


  return {
    allowance: allowanceJson,
    investorStatus: getInvestorStatus,
  }
}

export default fetchUserDao
