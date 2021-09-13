import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import ApyCell from './Cells/ApyCell'
import ActionCell from './Cells/ActionCell'
import PoolCell from './Cells/PoolCell'
import LevarageCell from './Cells/LevarageCell'
import TvlCell from './Cells/TvlCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  //cursor: pointer;
`

const LevarageRow = ({ tokenData }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const { lpSymbol, tvl, levarage, reserveTokenOne } = tokenData

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <PoolCell pool={lpSymbol} />
        <ApyCell apy={reserveTokenOne} />
        {isDesktop && <TvlCell tvl={tvl} />}
        {isDesktop && <LevarageCell levarage={levarage} />}
        {isDesktop && <ActionCell />}
      </StyledRow>
    </>
  )
}

export default LevarageRow
