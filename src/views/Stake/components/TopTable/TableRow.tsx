import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import NameCell from './Cells/NameCell'
import ApyCell from './Cells/ApyCell'
import HtokenCell from './Cells/HtokenCell'
import AssetValueCell from './Cells/AssetValueCell'
import ActionCell from './Cells/ActionCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  //cursor: pointer;
`

const TableRow = ({ data }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const { name, landApr, totalDeposit, totalBorrowed, capitalUtilizationRate } = data

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <NameCell name={data[0]?.name} />
        <ApyCell apy={data[0]?.landApr} />
        {isDesktop && <HtokenCell hToken={data[0]?.totalDeposit} />}
        {isDesktop && <AssetValueCell assetValue={data[0]?.capitalUtilizationRate} />}
        {isDesktop && <ActionCell />}
      </StyledRow>
    </>
  )
}

export default TableRow
