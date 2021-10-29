import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useHuskyPrice } from 'state/stake/hooks'
import { getStakeApy } from '../../helpers'
import AprCell from './Cells/AprCell'
import ActionCell from './Cells/ActionCell'
import TotalSupplyCell from './Cells/TotalSupplyCell'
import CurrencyCell from './Cells/CurrencyCell'
import RewardsCell from './Cells/RewardsCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  //cursor: pointer;
`

const StakeRow = ({ tokenData }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)
  const huskyPrice = useHuskyPrice()
  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const { name, totalToken } = tokenData
  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <CurrencyCell token={tokenData} />
        <AprCell getApyData={getStakeApy(tokenData, huskyPrice)} />
        <TotalSupplyCell supply={parseInt(totalToken)} />
        <ActionCell token={tokenData} />
        <RewardsCell token={tokenData} />
      </StyledRow>
    </>
  )
}

export default StakeRow
