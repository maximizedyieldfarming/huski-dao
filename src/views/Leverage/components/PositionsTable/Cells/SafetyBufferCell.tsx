import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip, TooltipText } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

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
          <Flex>
            <Text>{safetyBuffer}%</Text>
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default SafetyBufferCell
