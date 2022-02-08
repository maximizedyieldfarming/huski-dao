import { getAddress } from 'utils/addressHelpers'
import { getWeb3VaultContract } from 'utils/contractHelpers';
import { Dao, SerializedBigNumber } from '../types'

type PublicDaoData = {
  code: SerializedBigNumber
  price: string
  roundID: string
  startedAt: string
  timeStamp: string
  answeredInRound: string
}

const fetchDao = async (dao: Dao): Promise<PublicDaoData> => {
  const { vaultAddress } = dao
  const vaultAddresses = getAddress(vaultAddress)
  const vault = getWeb3VaultContract(vaultAddresses);
  const getCode = await vault.methods.getCode().call();
  const getPrice = await vault.methods.getPrice().call();

  return {
    code: getCode.toString(),
    price: getPrice[0],
    roundID: getPrice[1],
    startedAt: getPrice[2],
    timeStamp: getPrice[3],
    answeredInRound: getPrice[4],
  }
}

export default fetchDao
