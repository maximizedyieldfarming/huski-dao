import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useHuskyPrice } from 'state/leverage/hooks'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getDecimalAmount, getBalanceAmount } from 'utils/formatBalance'
import NameCell from './Cells/NameCell'
import { getAprData } from '../../helpers'
import UtilRateCell from './Cells/UtilRateCell'
import ApyCell from './Cells/ApyCell'
import TotalSupplyCell from './Cells/TotalSupplyCell'
import TotalBorrowedCell from './Cells/TotalBorrowedCell'
import BalanceCell from './Cells/BalanceCell'
import ActionCell from './Cells/ActionCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  //cursor: pointer;
`

const LendRow = ({ tokenData }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const huskyPrice = useHuskyPrice()
  const { lendApr, stakeApr, totalApr, apy } = getAprData(tokenData, huskyPrice)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }
  const { totalToken, vaultDebtVal, userData, TokenInfo, tokenPriceUsd } = tokenData
  const totalSupplyUSD = Number(totalToken) * Number(tokenPriceUsd)
  const totalBorrowedUSD = Number(vaultDebtVal) * Number(tokenPriceUsd)

  const { balance: tokenBalance } = useTokenBalance(getAddress(tokenData.TokenInfo.token.address))
  const { balance: bnbBalance } = useGetBnbBalance()
  const tokenBalanceIb = tokenData?.userData?.tokenBalanceIB
  const userTokenBalance = getBalanceAmount(
    TokenInfo.token.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
  ).toJSON()
  const userIbTokenBalance = getBalanceAmount(tokenBalanceIb).toJSON()

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <NameCell token={tokenData} />
        <ApyCell getApyData={getAprData(tokenData, huskyPrice)} token={tokenData} />
        <TotalSupplyCell supply={Number(totalToken)} supplyUSD={totalSupplyUSD} />
        <TotalBorrowedCell borrowed={Number(vaultDebtVal)} borrowedUSD={totalBorrowedUSD} />
        <UtilRateCell utilRate={totalToken > 0 ? vaultDebtVal / totalToken : 0} />
        <BalanceCell
          balance={userTokenBalance}
          balanceIb={userIbTokenBalance}
          name={TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}
        />
        <ActionCell token={tokenData} />
      </StyledRow>
    </>
  )
}

export default LendRow
