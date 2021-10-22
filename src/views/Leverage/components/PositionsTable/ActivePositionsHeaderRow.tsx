import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, useTooltip, InfoIcon, Flex } from '@pancakeswap/uikit'
import BaseCell, { CellContent } from './Cells/BaseCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
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
const ActivePositionsHeaderRow = () => {
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
    targetRef: debtTargetRef,
    tooltip: debtTooltip,
    tooltipVisible: debtTooltipVisible,
  } = useTooltip(
    <>
      <Text>Debt Value = Borrowed Asset + Borrowing Interest</Text>
      <Text>Borrowed Asset:</Text>
      <Text>Borrowing Interest: </Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: equityTargetRef,
    tooltip: equityTooltip,
    tooltipVisible: equityTooltipVisible,
  } = useTooltip(
    <>
      <Text>Equity Value = Position Value - Debt Value</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: apyTargetRef,
    tooltip: apyTooltip,
    tooltipVisible: apyTooltipVisible,
  } = useTooltip(
    <>
      <Flex justifyContent="space-between">
        <Text small>Pancake Liquitity Rewards:</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>Pancake Trading Fee Rewards:</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>Huski Token Rewards:</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>Borrowing Interest:</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>APR:</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>APY:</Text>
      </Flex>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: debtRatioTargetRef,
    tooltip: debtRatioTooltip,
    tooltipVisible: debtRatioTooltipVisible,
  } = useTooltip(
    <>
      <Text>Debt Ratio = Debt Value / Position Value</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: liquidationThresholdTargetRef,
    tooltip: liquidationThresholdTooltip,
    tooltipVisible: liquidationThresholdTooltipVisible,
  } = useTooltip(
    <>
      <Text>When the debt ratio exceeds liquidation ratio, your position may be liquidated.</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: safetyBufferTargetRef,
    tooltip: safetyBufferTooltip,
    tooltipVisible: safetyBufferTooltipVisible,
  } = useTooltip(
    <>
      <Text>Risk Ratio = Liquidation Ratio - Debt Ratio</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: profitLossTargetRef,
    tooltip: profitLossTooltip,
    tooltipVisible: profitLossTooltipVisible,
  } = useTooltip(
    <>
      <Text>Profit and loss information of your position</Text>
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
              Debt
            </Text>
            {debtTooltipVisible && debtTooltip}
            <span ref={debtTargetRef}>
              <InfoIcon ml="5px" />
            </span>
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text small color="textSubtle">
              Equity
            </Text>
            {equityTooltipVisible && equityTooltip}
            <span ref={equityTargetRef}>
              <InfoIcon ml="5px" />
            </span>
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text small color="textSubtle">
              APY
            </Text>
            {apyTooltipVisible && apyTooltip}
            <span ref={apyTargetRef}>
              <InfoIcon ml="5px" />
            </span>
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text small color="textSubtle">
              Debt Ratio
            </Text>
            {debtRatioTooltipVisible && debtRatioTooltip}
            <span ref={debtRatioTargetRef}>
              <InfoIcon ml="5px" />
            </span>
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text small color="textSubtle">
              Liquidation Threshold
            </Text>
            {liquidationThresholdTooltipVisible && liquidationThresholdTooltip}
            <span ref={liquidationThresholdTargetRef}>
              <InfoIcon ml="5px" />
            </span>
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text small color="textSubtle">
              Safety Buffer
            </Text>
            {safetyBufferTooltipVisible && safetyBufferTooltip}
            <span ref={safetyBufferTargetRef}>
              <InfoIcon ml="5px" />
            </span>
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text small color="textSubtle">
              Profit/Loss
            </Text>
            {profitLossTooltipVisible && profitLossTooltip}
            <span ref={profitLossTargetRef}>
              <InfoIcon ml="5px" />
            </span>
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent />
      </StyledCell>
    </StyledRow>
  )
}

export default ActivePositionsHeaderRow
