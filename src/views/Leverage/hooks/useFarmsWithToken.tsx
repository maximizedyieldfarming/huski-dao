import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { BIG_TEN, BIG_ZERO, PER_YEAR } from 'utils/config';
import multicall from 'utils/multicall'
import { LeverageFarm } from 'state/types'
import { getAddress } from 'utils/addressHelpers'
import ConfigurableInterestVaultConfigABI from 'config/abi/ConfigurableInterestVaultConfig.json'
import { getDecimalAmount } from 'utils/formatBalance'
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
      const vaultDebtValBigNumber = vaultDebtValue ? new BigNumber(vaultDebtValue) : BIG_ZERO
      const totalTokenBigNumber = totalTokenValue ? new BigNumber(totalTokenValue) : BIG_ZERO
      const vaultDebtValData = Math.ceil(vaultDebtValBigNumber.toNumber())
      const totalTokenData = Math.ceil(totalTokenBigNumber.toNumber())
      const vdd = getDecimalAmount(new BigNumber(vaultDebtValData || 0), 0)
        .toString()
        .replace(/\.(.*?\d*)/g, '')
      const ttdMinusVdd = new BigNumber(totalTokenData).minus(new BigNumber(vaultDebtValData))
      const minusData = getDecimalAmount(new BigNumber(ttdMinusVdd || 0), 0)
        .toString()
        .replace(/\.(.*?\d*)/g, '')

      const [borrowInterest] =
        await multicall(ConfigurableInterestVaultConfigABI, [
          {
            address: configAddress,
            name: 'getInterestRate',
            params: [vdd, minusData],
          }
        ])

      // const borrowingInterestData = parseInt(borrowInterest[0]._hex) * 365 * 24 * 60 * 60 / (10 ** 18)

      const borrowInterestBigNumber = new BigNumber(borrowInterest[0]._hex).times(PER_YEAR)
      const borrowingInterestPow = new BigNumber(borrowInterestBigNumber).div(BIG_TEN.pow(18))
      const borrowingInterestData = Number(borrowingInterestPow)

      setBorrowingInterest(borrowingInterestData)
    }

    fetchBorrowingInterest()
  }, [configAddressValue, token, token.config, token.symbol, totalToken, totalTokenValue, vaultDebtVal, vaultDebtValue])

  return { borrowingInterest }
}

export default useFarmsWithToken
