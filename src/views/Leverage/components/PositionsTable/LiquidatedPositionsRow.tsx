import React from 'react'
import styled from 'styled-components'
import NameCell from './Cells/NameCell'
import PoolCell from './Cells/PoolCell'
import PositionValueCell from './Cells/PositionValueCell'
import LiquidatedEquityCell from './Cells/LiquidatedEquityCell'
import LiquidationFeeCell from './Cells/LiquidationFeeCell'
import AssetsReturnedCell from './Cells/AssetsReturnedCell'
import TxRecordCell from './Cells/TxRecordCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }

  //cursor: pointer;
`

const LiquidatedPositionsRow = ({ data }) => {
  return (
    <>
      <StyledRow role="row">
        <NameCell name={null} positionId={null} />
        <PoolCell pool={null} quoteToken={null} token={null} />
        <PositionValueCell position={null} name={null} />
        <LiquidatedEquityCell liqEquity={null} />
        <LiquidationFeeCell fee={null} />
        <AssetsReturnedCell assetsReturned={null} />
        <TxRecordCell />
      </StyledRow>
    </>
  )
}

export default LiquidatedPositionsRow
