import React from 'react'
import styled from 'styled-components'
import { useHuskiPrice } from 'hooks/api'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount } from 'utils/formatBalance'
import NameCell from './Cells/NameCell'
import { getAprData } from '../../helpers'
import { useFarmsWithToken } from '../../../Leverage/hooks/useFarmsWithToken'
import UtilRateCell from './Cells/UtilRateCell'
import ApyCell from './Cells/ApyCell'
import TotalSupplyCell from './Cells/TotalSupplyCell'
import TotalBorrowedCell from './Cells/TotalBorrowedCell'
import BalanceCell from './Cells/BalanceCell'
import ActionCell from './Cells/ActionCell'

const StyledRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    height: 90px;
    border-radius: 12px;
    margin-top: 10px;
    &:hover {
      background: ${({ theme }) => (theme.isDark ? '#272B30' : '#F7F7F8')};
    }
    &:active {
      background: ${({ theme }) => (theme.isDark ? '#272B30' : '#F7F7F8')};
    }
  }
`

const LendRow = ({ tokenData }) => {
  const huskyPrice = useHuskiPrice()
  const tokenName = tokenData?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
  const { borrowingInterest } = useFarmsWithToken(tokenData, tokenName)
  const { totalToken, vaultDebtVal, TokenInfo, tokenPriceUsd } = tokenData
  const totalSupplyUSD = Number(totalToken) * Number(tokenPriceUsd)
  const totalBorrowedUSD = Number(vaultDebtVal) * Number(tokenPriceUsd)
  const { balance: tokenBalance } = useTokenBalance(getAddress(tokenData.TokenInfo.token.address))
  const { balance: bnbBalance } = useGetBnbBalance()
  const userTokenBalance = getBalanceAmount(
    TokenInfo.token.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
  ).toJSON()
  const userTokenBalanceIb = getBalanceAmount(useTokenBalance(tokenData?.TokenInfo.vaultAddress).balance).toJSON()
  const { apy } = getAprData(tokenData, huskyPrice, borrowingInterest)

  return (
    <StyledRow role="row">
      <NameCell token={tokenData} />
      <ApyCell getApyData={getAprData(tokenData, huskyPrice, borrowingInterest)} token={tokenData} />
      <TotalSupplyCell supply={Number(totalToken)} supplyUSD={totalSupplyUSD} name={tokenName} />
      <TotalBorrowedCell borrowed={Number(vaultDebtVal)} borrowedUSD={totalBorrowedUSD} name={tokenName} />
      <UtilRateCell utilRate={totalToken > 0 ? vaultDebtVal / totalToken : 0} />
      <BalanceCell
        balance={userTokenBalance}
        balanceIb={userTokenBalanceIb}
        name={TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}
        decimals={TokenInfo?.token?.decimalsDigits}
      />
      <ActionCell token={tokenData} apyReady={!!totalToken} />
    </StyledRow>
  )
}

export default LendRow
