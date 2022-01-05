import React from 'react'
import styled from 'styled-components'
import {
  Text,
  useMatchBreakpoints,
  Skeleton,
  Flex,
  InfoIcon,
  useTooltip,
  TooltipText,
  Box,
} from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import { LinearProgress } from '@material-ui/core'
import BaseCell, { CellContent } from './BaseCell'

interface Props {
  safetyBuffer: number
  quoteTokenName: string
  tokenName: string
  priceDrop: number | string
  noDebt?: boolean
  debtRatioRound?: any
  liquidationThresholdData?: any
}

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`
const SBLinearProgress = styled.div`
  display: flex;
  position: relative;
  background-color: #e2e2e2;
  width: 60px;
  height: 6px;
  border-radius: 6px;
  > div {
    height: 6px;
    position: absolute;
  }
`

const SafetyBufferCell: React.FC<Props> = ({
  safetyBuffer,
  quoteTokenName,
  tokenName,
  priceDrop,
  noDebt,
  liquidationThresholdData,
  debtRatioRound,
}) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const {
    targetRef: bufferTargetRef,
    tooltip: bufferTooltip,
    tooltipVisible: bufferTooltipVisible,
  } = useTooltip(
    <>
      <Text>Debt Ratio - {debtRatioRound.toFixed(2)}%</Text>
    </>,
    { placement: 'bottom', bgcolor: '#2E2D2E' },
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>Liquidation Ratio - {liquidationThresholdData.toFixed(2)}%</Text>
    </>,
    { placement: 'bottom', bgcolor: '#7B3FE4' },
  )
  if (noDebt) {
    return (
      <StyledCell role="cell">
        <CellContent>
          {(isMobile || isTablet) && (
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Safety Buffer')}
            </Text>
          )}
          <Text>{t('No Debt')}</Text>
        </CellContent>
      </StyledCell>
    )
  }
  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Safety Buffer')}
            </Text>
          </Flex>
        )}
        {safetyBuffer ? (
          <>
            <Flex alignItems="center" style={{ gap: '10px' }} mt="8px">
              <Text color="text" fontWeight="600" fontSize="16px">
                {safetyBuffer}%
              </Text>
              {/* <SBLinearProgress
                variant="determinate"
                value={safetyBuffer}
                style={{ height: '6px', width: '40px', color: '#7B3FE4', background: '#CCCCCC', borderRadius: 6 }}
              /> */}
              <SBLinearProgress>
                {bufferTooltipVisible && bufferTooltip}
                <Box
                  borderRadius="50%"
                  width="6px"
                  background="#2E2D2E"
                  zIndex={1}
                  ref={bufferTargetRef}
                  left={`${(debtRatioRound / 100) * 60}px`}
                />
                <Box
                  background="#9054DB"
                  left={`${(Math.min(liquidationThresholdData, debtRatioRound) / 100) * 60 + 4}px`}
                  width={`${(Math.abs(liquidationThresholdData - debtRatioRound) / 100) * 60}px`}
                />
                {tooltipVisible && tooltip}
                <Box
                  borderRadius="50%"
                  width="6px"
                  background="#5D12DD"
                  zIndex={1}
                  ref={targetRef}
                  left={`${(liquidationThresholdData / 100) * 60}px`}
                />
              </SBLinearProgress>
              {/* {tooltipVisible && tooltip}
              <span ref={targetRef} style={{ marginTop: '8px' }}>
                <InfoIcon ml="10px" />
              </span> */}
            </Flex>
          </>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default SafetyBufferCell
