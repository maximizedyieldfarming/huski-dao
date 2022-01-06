import React from 'react'
import styled from 'styled-components'
import { Skeleton, Text, useMatchBreakpoints, Flex, InfoIcon, useTooltip } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 auto;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`

const PositionValueCell = ({ position, name }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()

  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>{t('Position value = Debt Value + Equity Value + Yield')}</Text>
    </>,
    { placement: 'top-start' },
  )
  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <Text color="textSubtle" textAlign="left">
              {t('Position')}
            </Text>
            {/* {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span> */}
          </Flex>
        )}
        {position && !position.isNaN() ? (
          <Text bold>
            {position.toNumber().toFixed(3)} {name}
          </Text>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default PositionValueCell
