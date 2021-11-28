import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip, TooltipText } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import { LinearProgress } from '@material-ui/core';
import BaseCell, { CellContent } from './BaseCell'

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
    background-color:#7B3FE4!important;
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

const SafetyBufferCell = ({ safetyBuffer }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>{t('Risk Ratio = Liquidation Ratio - Debt Ratio')}</Text>
    </>,
    { placement: 'top-start' },
  )
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
            <Flex alignItems='center' style={{ gap: '10px' }} mt="8px">
              <Text color="text" fontWeight="600" fontSize="16px">{safetyBuffer}%</Text>
              <SBLinearProgress
                variant="determinate"
                value={safetyBuffer}
                style={{ height: '6px', width: '40px', color: '#7B3FE4', background: '#CCCCCC', borderRadius: 6 }}
              />
            </Flex>
            <div style={{ marginLeft: '15px', marginTop: '4px', background: '#FFFEFE', borderRadius: '10px', color: '#4B4B4B', fontSize: '9px' }}>Debt Ratio - 43.60%</div>
          </>
        ) : (
          <>
            <Flex alignItems='center' style={{ gap: '10px' }} mt="8px">
              <Text color="text" fontWeight="600" fontSize="16px">53.4%</Text>
              <SBLinearProgress
                variant="determinate"

                value={53.4}
                style={{ height: '6px', width: '40px', color: '#7B3FE4', background: '#CCCCCC', borderRadius: 6 }}
              />
            </Flex>
            <div style={{ marginLeft: '15px', marginTop: '4px', background: '#FFFEFE', borderRadius: '10px', color: '#4B4B4B', fontSize: '9px' }}>Debt Ratio - 43.60%</div>
          </>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default SafetyBufferCell
