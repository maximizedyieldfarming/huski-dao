import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import { LeverageFarm } from 'state/types'
import { getAddress } from 'utils/addressHelpers'
import ConfigurableInterestVaultConfigABI from 'config/abi/ConfigurableInterestVaultConfig.json'
import useRefresh from 'hooks/useRefresh'

export const useFarmsWithToken = (farm: LeverageFarm, tokenName?: string) => {
  const [borrowingInterest, setBorrowingInterest] = useState(0)


  const { totalToken, vaultDebtVal, TokenInfo, quoteTokenTotal, quoteTokenVaultDebtVal } = farm
  const { token, quoteToken } = TokenInfo
  let totalTokenValue
  let vaultDebtValue
  let configAddressValue
  if (tokenName?.toUpperCase() === quoteToken?.symbol.toUpperCase() || tokenName?.toUpperCase() === quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')) {
    totalTokenValue = quoteTokenTotal
    vaultDebtValue = quoteTokenVaultDebtVal
    configAddressValue = quoteToken.config
  } else {
    totalTokenValue = totalToken
    vaultDebtValue = vaultDebtVal
    configAddressValue = token.config
  }


  useEffect(() => {
    const fetchBorrowingInterest = async () => {
      const configAddress = getAddress(configAddressValue)
      const vaultDebtValBigNumber = vaultDebtValue ? new BigNumber(parseInt(vaultDebtValue)).div(BIG_TEN.pow(18)) : BIG_ZERO
      const totalTokenBigNumber = totalTokenValue ? new BigNumber(parseInt(totalTokenValue)).div(BIG_TEN.pow(18)) : BIG_ZERO
      const vaultDebtValData = Math.round(vaultDebtValBigNumber.toNumber())
      const totalTokenData = Math.round(totalTokenBigNumber.toNumber())

      const [borrowInterest] =
        await multicall(ConfigurableInterestVaultConfigABI, [
          {
            address: configAddress,
            name: 'getInterestRate',
            params: [vaultDebtValData, totalTokenData - vaultDebtValData],
          }
        ])

      console.info('borrowingInterest', borrowInterest)
      console.info(token)
      const borrowingInterestData = parseInt(borrowInterest[0]._hex) * 365 * 24 * 60 * 60 / (10 ** 18)
      console.info(borrowingInterestData)
      setBorrowingInterest(borrowingInterestData)
    }

    fetchBorrowingInterest()
  }, [configAddressValue, token, token.config, token.symbol, totalToken, totalTokenValue, vaultDebtVal, vaultDebtValue])

  return { borrowingInterest }
}

export default useFarmsWithToken
