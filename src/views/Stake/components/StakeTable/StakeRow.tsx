import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import AprCell from './Cells/AprCell'
import ActionCell from './Cells/ActionCell'
import TotalSupplyCell from './Cells/TotalSupplyCell'
import CurrencyCell from './Cells/CurrencyCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  //cursor: pointer;
`

const StakeRow = ({ tokenData }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const { name, stakeAPR, stakeValue } = tokenData

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <CurrencyCell name={name} />
        <AprCell apr={stakeAPR} />
        {isDesktop && <TotalSupplyCell supply={stakeValue} />}
        {isDesktop && <ActionCell name={name} />}
      </StyledRow>
    </>
  )
}

export default StakeRow
