import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import ApyCell from './Cells/ApyCell'
import ActionCell from './Cells/ActionCell'
import PoolCell from './Cells/PoolCell'
import LeverageCell from './Cells/LeverageCell'
import TvlCell from './Cells/TvlCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  //cursor: pointer;
`

const LeverageRow = ({ tokenData }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const { lpSymbol, tvl, leverage, reserveTokenOne, quoteToken, token } = tokenData

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <PoolCell pool={lpSymbol} quoteToken={quoteToken} token={token} />
        <ApyCell apy={reserveTokenOne} />
        {isDesktop && <TvlCell tvl={tvl} />}
        {isDesktop && <LeverageCell leverage={leverage} />}
        {isDesktop && <ActionCell token={tokenData} />}
      </StyledRow>
    </>
  )
}

export default LeverageRow
