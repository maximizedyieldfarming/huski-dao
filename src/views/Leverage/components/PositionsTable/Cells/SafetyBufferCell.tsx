import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip, TooltipText } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import { LinearProgress } from '@material-ui/core'
import BaseCell, { CellContent } from './BaseCell'

interface Props {
  safetyBuffer: number
  quoteTokenName: string
  tokenName: string
  priceDrop: number | string
  noDebt?: boolean
}

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
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
const SBLinearProgress = styled(LinearProgress)`
  .MuiLinearProgress-barColorPrimary {
    background-color: #7b3fe4 !important;
  }
`
const Circle = styled.div`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: black;
  .inner {
    height: 10px;
    width: 10px;
    background-color: purple;
    transform: rotate(180deg);
  }
`

const ProgressCircle = () => {
  return (
    <Circle className="pie-wrapper pie-wrapper--solid progress-88">
      <div className="inner" />
    </Circle>
  )
}

const SafetyBufferCell: React.FC<Props> = ({ safetyBuffer, quoteTokenName, tokenName, priceDrop, noDebt }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>{t('Risk Ratio = Liquidation Ratio - Debt Ratio')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: bufferTargetRef,
    tooltip: bufferTooltip,
    tooltipVisible: bufferTooltipVisible,
  } = useTooltip(
    <>
      <Text style={{ borderBottom: '1px solid black' }}>
        {t(
          'At the current safety buffer, %quoteTokenName% price can drop -%priceDrop%% against %tokenName% before your position would be in danger of liquidation.',
          { quoteTokenName, tokenName, priceDrop },
        )}
      </Text>
      <Text>
        <Text bold>{t('Disclaimer: ')}</Text>
        {t(
          'This is only an estimate and the actual liquidation price can vary based on other factors such as your position size relative to the pools liquidity.',
        )}
      </Text>
    </>,
    { placement: 'top-start' },
  )
  if (noDebt) {
    return (
      <StyledCell role="cell">
        <CellContent>
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
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
        )}
        {safetyBuffer ? (
          <>
            {bufferTooltipVisible && bufferTooltip}

            <Flex alignItems="center" style={{ gap: '10px' }} mt="8px" ref={bufferTargetRef}>
              <Text color="text" fontWeight="600" fontSize="16px">
                {safetyBuffer}%
              </Text>
              <SBLinearProgress
                variant="determinate"
                value={safetyBuffer}
                style={{ height: '6px', width: '40px', color: '#7B3FE4', background: '#CCCCCC', borderRadius: 6 }}
              />
            </Flex>
            {/*  <div
              style={{
                marginLeft: '15px',
                marginTop: '4px',
                background: '#FFFEFE',
                borderRadius: '10px',
                color: '#4B4B4B',
                fontSize: '9px',
              }}
            >
              Debt Ratio - 43.60%
            </div> */}
          </>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default SafetyBufferCell
