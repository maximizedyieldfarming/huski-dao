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
`

const EquityCell = ({ equity, name }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>{t('Equity Value = Position Value - Debt Value')}</Text>
    </>,
    { placement: 'top-start' },
  )
  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Equity')}
            </Text>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
        )}
        {equity ? (
          <Text>
            {equity.toFixed(3)} {name}
          </Text>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default EquityCell
