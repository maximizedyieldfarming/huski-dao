import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, useTooltip, InfoIcon, Flex } from '@pancakeswap/uikit'
import BaseCell, { CellContent } from './Cells/BaseCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  border-bottom: none !important;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  //cursor: pointer;
`

const NameCell = styled(BaseCell)`
  // flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    // flex: 1 0 150px;
    padding-left: 32px;
  }
`
const PoolCell = styled(BaseCell)`
  flex: 5;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 2 0 150px;
  }
  ${Text} {
    white-space: nowrap;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`
const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`

const LiquidatedPositionsHeaderRow = () => {
  const {
    targetRef: positionTargetRef,
    tooltip: positionTooltip,
    tooltipVisible: positionTooltipVisible,
  } = useTooltip(
    <>
      <Text>Position value = Debt Value + Equity Value + Yield</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: liquidatedEquityTargetRef,
    tooltip: liquidatedEquityTooltip,
    tooltipVisible: liquidatedEquityTooltipVisible,
  } = useTooltip(
    <>
      <Text>Liquidated Equity = 83.33% * Equity Value</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: liquidationFeeTargetRef,
    tooltip: liquidationFeeTooltip,
    tooltipVisible: liquidationFeeTooltipVisible,
  } = useTooltip(
    <>
      <Text>Liquidation fee = 5% * Liquidated Equity</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: assetsReturnedTargetRef,
    tooltip: assetsReturnedTooltip,
    tooltipVisible: assetsReturnedTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        The position value will be converted into base tokens (BUSD or BNB). Part of it will pay back your debt, accrued
        interest, and the liquidation fee. Then, you&apos;ll receive the remaining tokens in your wallet.
      </Text>
    </>,
    { placement: 'top-start' },
  )

  return (
    <StyledRow>
      <StyledCell>
        <CellContent />
      </StyledCell>
      <PoolCell>
        <CellContent>
          <Text small color="textSubtle">
            Pool
          </Text>
        </CellContent>
      </PoolCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text small color="textSubtle">
              Position
            </Text>
            {positionTooltipVisible && positionTooltip}
            <span ref={positionTargetRef}>
              <InfoIcon ml="5px" />
            </span>
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text small color="textSubtle">
              Liquidated Equity
            </Text>
            {liquidatedEquityTooltipVisible && liquidatedEquityTooltip}
            <span ref={liquidatedEquityTargetRef}>
              <InfoIcon ml="5px" />
            </span>
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text small color="textSubtle">
              Liquidation Fee
            </Text>
            {liquidationFeeTooltipVisible && liquidationFeeTooltip}
            <span ref={liquidationFeeTargetRef}>
              <InfoIcon ml="5px" />
            </span>
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text small color="textSubtle">
              Assets Returned
            </Text>
            {assetsReturnedTooltipVisible && assetsReturnedTooltip}
            <span ref={assetsReturnedTargetRef}>
              <InfoIcon ml="5px" />
            </span>
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text small color="textSubtle">
            TX Record
          </Text>
        </CellContent>
      </StyledCell>
    </StyledRow>
  )
}

export default LiquidatedPositionsHeaderRow
