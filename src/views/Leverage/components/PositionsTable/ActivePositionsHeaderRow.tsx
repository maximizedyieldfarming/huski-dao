import React from 'react'
import styled from 'styled-components'
import { Text, useTooltip, InfoIcon, Flex } from 'husky-uikit1.0'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './Cells/BaseCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid #EFEFEF;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  //cursor: pointer;
`

const NameCell = styled(BaseCell)`
  flex: 1 0 50px;
  flex-direction: column;
  // padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.md} {
     flex: 1 0 100px;
    // padding-left: 32px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: flex-start;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`
const PoolCell = styled(BaseCell)`
  align-items:start;
  flex: 5;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 2 0 170px;
  }
  ${Text} {
    white-space: nowrap;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: flex-start;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`
const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  padding-bottom:10px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: flex-start;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`
const ActivePositionsHeaderRow = () => {
  const { t } = useTranslation()
  const {
    targetRef: positionTargetRef,
    tooltip: positionTooltip,
    tooltipVisible: positionTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Position value = Debt Value + Equity Value + Yield')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: debtTargetRef,
    tooltip: debtTooltip,
    tooltipVisible: debtTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Debt Value = Borrowed Asset + Borrowing Interest')}</Text>
      {/*   <Text>Borrowed Asset:</Text>
      <Text>Borrowing Interest: </Text> */}
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: equityTargetRef,
    tooltip: equityTooltip,
    tooltipVisible: equityTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Equity Value = Position Value - Debt Value')}</Text>
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
        <Text small>{t('Pancake Liquitity Rewards:')}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Pancake Trading Fee Rewards:')}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Huski Token Rewards:')}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Borrowing Interest:')}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('APR:')}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('APY:')}</Text>
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
      <Text>{t('Debt Ratio = Debt Value / Position Value')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: liquidationThresholdTargetRef,
    tooltip: liquidationThresholdTooltip,
    tooltipVisible: liquidationThresholdTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('When the debt ratio exceeds liquidation ratio, your position may be liquidated.')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: safetyBufferTargetRef,
    tooltip: safetyBufferTooltip,
    tooltipVisible: safetyBufferTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Risk Ratio = Liquidation Ratio - Debt Ratio')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: profitLossTargetRef,
    tooltip: profitLossTooltip,
    tooltipVisible: profitLossTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Profit and loss information of your position')}</Text>
    </>,
    { placement: 'top-start' },
  )
  return (
    <StyledRow>
      <NameCell>
        <CellContent>
          <Text fontSize='13px' bold color="textSubtle">
            {t('Name')}
          </Text>
        </CellContent>
      </NameCell>
      <PoolCell>
        <CellContent>
          <Text fontSize='13px' style={{marginLeft:'-10px'}} bold color="textSubtle">
            {t('Pool')}
          </Text>
        </CellContent>
      </PoolCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text fontSize='13px' bold color="textSubtle">
              {t('Position Value')}
            </Text>
            {positionTooltipVisible && positionTooltip}
            {/* <span ref={positionTargetRef}>
              <InfoIcon ml="5px" />
            </span> */}
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text fontSize='13px' bold color="textSubtle">
              {t('Debt')}
            </Text>
            {debtTooltipVisible && debtTooltip}
            {/* <span ref={debtTargetRef}>
              <InfoIcon ml="5px" />
            </span> */}
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text fontSize='13px' bold color="textSubtle">
              {t('Equity')}
            </Text>
            {equityTooltipVisible && equityTooltip}
            {/* <span ref={equityTargetRef}>
              <InfoIcon ml="5px" />
            </span> */}
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text fontSize='13px' bold color="textSubtle">
              {t('APY')}
            </Text>
            {apyTooltipVisible && apyTooltip}
            {/* <span ref={apyTargetRef}>
              <InfoIcon ml="5px" />
            </span> */}
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text fontSize='13px' bold color="textSubtle">
              {t('Debt Ratio')}
            </Text>
            {debtRatioTooltipVisible && debtRatioTooltip}
            {/* <span ref={debtRatioTargetRef}>
              <InfoIcon ml="5px" />
            </span> */}
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="left">
            <Text fontSize='13px' bold color="textSubtle" style={{paddingRight:'40px'}}>
              {t('Liquidation Threshold')}
            </Text>
            {liquidationThresholdTooltipVisible && liquidationThresholdTooltip}
            {/* <span ref={liquidationThresholdTargetRef}>
              <InfoIcon ml="5px" />
            </span> */}
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text fontSize='13px' bold color="textSubtle">
              {t('Safety Buffer')}
            </Text>
            {safetyBufferTooltipVisible && safetyBufferTooltip}
            {/* <span ref={safetyBufferTargetRef}>
              <InfoIcon ml="5px" />
            </span> */}
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text fontSize='13px' bold color="textSubtle">
              {t('Profit/Loss')}
            </Text>
            {profitLossTooltipVisible && profitLossTooltip}
            {/* <span ref={profitLossTargetRef}>
              <InfoIcon ml="5px" />
            </span> */}
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent >
          <Flex alignItems="center" justifyContent="flex-end">
            <Text fontSize='13px' style={{width:'230px',textAlign:'right'}} bold color="textSubtle">
              {t('Action')}
            </Text>
            {profitLossTooltipVisible && profitLossTooltip}
            {/* <span ref={profitLossTargetRef}>
              <InfoIcon ml="5px" />
            </span> */}
          </Flex>
        </CellContent>
      </StyledCell>
    </StyledRow>
  )
}

export default ActivePositionsHeaderRow
