import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import NameCell from './Cells/NameCell'
import UtilRateCell from './Cells/UtilRateCell'
import ApyCell from './Cells/ApyCell'
import TotalSupplyCell from './Cells/TotalSupplyCell'
import TotalBorrowedCell from './Cells/TotalBorrowedCell'
import BalanceCell from './Cells/BalanceCell'
import ActionCell from './Cells/ActionCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  //cursor: pointer;
`

const LendRow = ({ tokenData }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const { name, apy, totalDeposit, totalBorrowed, capitalUtilizationRate } = tokenData

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <NameCell token={tokenData} />
        <ApyCell apy={apy} />
        {isDesktop && <TotalSupplyCell supply={totalDeposit} />}
        {isDesktop && <TotalBorrowedCell borrowed={totalBorrowed} />}
        {isDesktop && <UtilRateCell utilRate={capitalUtilizationRate} />}
        <BalanceCell balance="" />
        {isDesktop && <ActionCell name={name} />}
      </StyledRow>
    </>
  )
}

export default LendRow
