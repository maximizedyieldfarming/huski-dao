import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import ConfigurableInterestVaultConfigABI from 'config/abi/ConfigurableInterestVaultConfig.json'
import useRefresh from 'hooks/useRefresh'

export const useFarmsWithToken = (farm, bnbBalance, tokenBalance) => {
  const [borrowInterest, setBorrowInterest] = useState(0)
  const { vaultDebtVal, totalToken, token } = farm

  useEffect(() => {
    const fetchBorrowingInterest = async () => {
      const configAddress = getAddress(token.config)
      const vaultDebtValBigNumber = vaultDebtVal ? new BigNumber(parseInt(vaultDebtVal)).div(BIG_TEN.pow(18)) : BIG_ZERO
      const totalTokenBigNumber = totalToken ? new BigNumber(parseInt(totalToken)).div(BIG_TEN.pow(18)) : BIG_ZERO
      const vaultDebtValData = Math.round(vaultDebtValBigNumber.toNumber())
      const totalTokenData = Math.round(totalTokenBigNumber.toNumber())

      const [borrowingInterest] =
        await multicall(ConfigurableInterestVaultConfigABI, [
          {
            address: configAddress,
            name: 'getInterestRate',
            params: [vaultDebtValData, totalTokenData - vaultDebtValData],
          }
        ])
      const borrowingInterestData = parseInt(borrowingInterest[0]._hex) * 365 * 24 * 60 * 60 / (10 ** 18)
      setBorrowInterest(borrowingInterestData)
    }

    fetchBorrowingInterest()
  }, [bnbBalance, token.config, token.symbol, tokenBalance, totalToken, vaultDebtVal])

  return { borrowInterest }
}

export default useFarmsWithToken
