import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useHuskyPrice, useHuskyPerBlock } from 'state/leverage/hooks'
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
  const huskyPerBlock = useHuskyPerBlock()
  const { landApr, stakeApr, totalApr, apy } = getAprData(tokenData, huskyPrice, huskyPerBlock)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }
  const { totalToken, vaultDebtVal, userData,  } = tokenData

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <NameCell token={tokenData} />
        <ApyCell getApyData={getAprData(tokenData, huskyPrice, huskyPerBlock)} token={tokenData} />
        <TotalSupplyCell supply={parseInt(totalToken)} />
        <TotalBorrowedCell borrowed={parseInt(vaultDebtVal)} />
        <UtilRateCell utilRate={totalToken > 0 ? vaultDebtVal / totalToken : 0} />
        <BalanceCell
          balance={userData.tokenBalance}
          balanceIb={userData.tokenBalanceIB}
          name={tokenData?.token?.symbol}
        />
        <ActionCell token={tokenData} />
      </StyledRow>
    </>
  )
}

export default LendRow
