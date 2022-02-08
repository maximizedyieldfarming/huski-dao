import { getAddress } from 'utils/addressHelpers'
import { getVaultContract, getConfigContract } from 'utils/contractHelpers';
import { Dao, SerializedBigNumber } from '../types'

type PublicDaoData = {
  code: SerializedBigNumber
  price: string
  roundID: string
  startedAt: string
  timeStamp: string
  answeredInRound: string
  raiseFund: SerializedBigNumber
}

const fetchDao = async (dao: Dao): Promise<PublicDaoData> => {
  const { vaultAddress, configAddress } = dao
  const vaultAddresses = getAddress(vaultAddress)
  const configAddresses = getAddress(configAddress)
  const vault = getVaultContract(vaultAddresses);
  const getCode = await vault.methods.getCode().call();
  const getPrice = await vault.methods.getPrice().call();

  const config = getConfigContract(configAddresses);
  const getConfig = await config.getConfig();

  return {
    code: getCode.toString(),
    price: getPrice[0],
    roundID: getPrice[1],
    startedAt: getPrice[2],
    timeStamp: getPrice[3],
    answeredInRound: getPrice[4],
    raiseFund: getConfig[3]._hex,
  }
}

export default fetchDao
