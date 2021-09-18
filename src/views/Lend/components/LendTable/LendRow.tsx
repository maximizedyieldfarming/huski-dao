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
  //cursor: pointer;
`

const LendRow = ({ tokenData }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const huskyPrice = useHuskyPrice()
  const huskyPerBlock = useHuskyPerBlock()

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }
// name, apy, totalDeposit, totalBorrowed, capitalUtilizationRate, totalSupply,
  const { totalToken, vaultDebtVal, token ,userData} = tokenData
  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <NameCell token={tokenData} />
        <ApyCell apy={getAprData(tokenData, huskyPrice, huskyPerBlock)} />
        {isDesktop && <TotalSupplyCell supply={parseInt(totalToken)} />}
        {isDesktop && <TotalBorrowedCell borrowed={parseInt(vaultDebtVal)} />}
        {isDesktop && <UtilRateCell utilRate={totalToken > 0 ? vaultDebtVal / totalToken : 0} />}
        <BalanceCell balance={userData.tokenBalance} />
        {isDesktop && <ActionCell token={tokenData} />}
      </StyledRow>
    </>
  )
}

export default LendRow
