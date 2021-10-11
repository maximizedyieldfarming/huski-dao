import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import NameCell from './Cells/NameCell'
import ApyCell from './Cells/ApyCell'
import PoolCell from './Cells/PoolCell'
import ActionCell from './Cells/ActionCell'
import PositionCell from './Cells/PositionCell'
import DebtCell from './Cells/DebtCell'
import EquityCell from './Cells/EquityCell'
import DebtRatioCell from './Cells/DebtRatioCell'
import LiquidationThresholdCell from './Cells/LiquidationThresholdCell'
import SafetyBufferCell from './Cells/SafetyBufferCell'
import LiquidatedEquityCell from './Cells/LiquidatedEquityCell'
import LiquidationFeeCell from './Cells/LiquidationFeeCell'
import AssetsReturnedCell from './Cells/AssetsReturnedCell'
import ProfitsCell from './Cells/ProfitsCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  height: 350px;
  ${({ theme }) => theme.mediaQueries.lg} {
    height: unset;
    flex-direction: row;
  }

  //cursor: pointer;
`

const ScrollContainer = styled.div`
  overflow-x: auto;
  display: flex;
  flex: 1;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
`

const LiquidatedPositionsRow = ({ data }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <PoolCell pool={data[0]?.lpSymbol} />
        <ScrollContainer>
          <PositionCell position={data[0]?.totalDeposit} />
          <DebtCell debt={data[0]?.totalBorrowed} />

          <LiquidatedEquityCell liqEquity={data[0]?.liqEquity} />

          <LiquidationFeeCell fee={data[0]?.fee} />

          <AssetsReturnedCell assetsReturned={data[0]?.assetsReturned} />

          <ProfitsCell liqEquity={data[0]?.liqEquity} />
        </ScrollContainer>
      </StyledRow>
    </>
  )
}

export default LiquidatedPositionsRow
