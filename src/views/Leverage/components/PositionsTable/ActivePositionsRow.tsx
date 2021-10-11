import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import useFarmsWithToken from '../../hooks/usePositionsFarmsWithToken'
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
  ${({ theme }) => theme.mediaQueries.lg} {
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

const ActivePositionsRow = ({ data }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)
console.info('开仓关仓', data);
  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }


  const vaultAddress = data.vault;
  // useFarmsWithToken(vaultAddress)

  const totalPositionValueInUSDData = data.totalPositionValueInUSD;

  const debtValueData = data.debtValue;
  const totalPositionValueInUSD = new BigNumber(totalPositionValueInUSDData)

  // const debtValue = new BigNumber(data[0]?.debtValue).dividedBy(BIG_TEN.pow(18))

  const debtValue = new BigNumber(debtValueData).dividedBy(BIG_TEN.pow(18))

console.log({'debtValue-- ': parseInt(totalPositionValueInUSDData.hex) });


  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        {/* <PoolCell pool={data[0]?.lpSymbol} /> */}
        <ScrollContainer>
          {/* <PositionCell position={data[0]?.totalPositionValueInUSD} /> */}
          <DebtCell debt={debtValue} />
          {/* <EquityCell equity={data[0]?.capitalUtilizationRate} />
          <ApyCell apy={data[0]?.landApr} />
          <DebtRatioCell debtRatio={data[0]?.capitalUtilizationRate} />
          <LiquidationThresholdCell liqTres={data[0]?.capitalUtilizationRate} />
          <SafetyBufferCell safetyBuffer={data[0]?.capitalUtilizationRate} />
          <ProfitsCell liqEquity={data[0]?.liqEquity} />
          <ActionCell token={data[0]} /> */}
        </ScrollContainer>
      </StyledRow>
    </>
  )
}

export default ActivePositionsRow
