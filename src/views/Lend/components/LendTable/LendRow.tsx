import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'husky-uikit1.0'
import { useHuskyPrice } from 'state/leverage/hooks'
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
  const [isShown, setIsShown] = useState(false);
  
  return (
    <>
      <StyledRow 
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)} role="row" onClick={toggleExpanded}>
        <NameCell token={tokenData} />
        <ApyCell getApyData={getAprData(tokenData, huskyPrice)} token={tokenData} />
        <TotalSupplyCell supply={Number(totalToken)} supplyUSD={totalSupplyUSD} />
        <TotalBorrowedCell borrowed={Number(vaultDebtVal)} borrowedUSD={totalBorrowedUSD} />
        <UtilRateCell utilRate={totalToken > 0 ? vaultDebtVal / totalToken : 0} />
        <BalanceCell
          balance={userData.tokenBalance}
          balanceIb={userData.tokenBalanceIB}
          name={TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}
        />
        <ActionCell token={tokenData} />
      </StyledRow>
    </>
  )
}

export default LendRow
