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

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  //cursor: pointer;
`

const ScrollContainer = styled.div`
  overflow-x: scroll;
  display: flex;
`

const TableRow = ({ data, isActivePos }) => {
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
          {isXxl && <PositionCell position={data[0]?.totalDeposit} />}
          {isXxl && <DebtCell debt={data[0]?.totalBorrowed} />}
          {isXxl &&
            (isActivePos ? (
              <EquityCell equity={data[0]?.capitalUtilizationRate} />
            ) : (
              <LiquidatedEquityCell liqEquity={data[0]?.liqEquity} />
            ))}
          {isActivePos && <ApyCell apy={data[0]?.landApr} />}
          {isXxl && isActivePos && <DebtRatioCell debtRatio={data[0]?.capitalUtilizationRate} />}
          {isXxl &&
            (isActivePos ? (
              <LiquidationThresholdCell liqTres={data[0]?.capitalUtilizationRate} />
            ) : (
              <LiquidationFeeCell fee={data[0]?.fee} />
            ))}
          {isXxl &&
            (isActivePos ? (
              <SafetyBufferCell safetyBuffer={data[0]?.capitalUtilizationRate} />
            ) : (
              <AssetsReturnedCell assetsReturned={data[0]?.assetsReturned} />
            ))}
          {isDesktop && isActivePos && <ActionCell token={data[0]} />}
        </ScrollContainer>
      </StyledRow>
    </>
  )
}

export default TableRow
