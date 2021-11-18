import { useEffect,useState } from 'react'
import { getSumLendData } from 'utils/vaultService'
import useRefresh from 'hooks/useRefresh'
import mainnet from '../../mainnet.json'
import { sumTokenData } from '../utils'

export const useLendTotalSupply = () => {
  const [lendTotalSupply, setLendTotalSupply] = useState('')
  useEffect(() => {
    const lendTSData = mainnet.Vaults.map((pool) => {
      const lendTS = async () => {
        const totalToken = await getSumLendData(pool);
        return totalToken;
      };
      return lendTS();
    });
    Promise.all(lendTSData)
      .then((values) => {
        const returndata = sumTokenData(values)
        setLendTotalSupply(returndata)
      })
      .catch((error) => console.error('error', error));
  }, [setLendTotalSupply])
  return lendTotalSupply
}
