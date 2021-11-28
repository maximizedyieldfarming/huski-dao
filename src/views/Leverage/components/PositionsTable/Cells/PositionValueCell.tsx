import React from 'react'
import styled from 'styled-components'
import { Skeleton, Text, useMatchBreakpoints, Flex, InfoIcon, useTooltip } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
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
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('APY')}
            </Text>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
        )}
        {position && !position.isNaN() ? (
          <Text  color="text" fontWeight="600" fontSize="16px" mt="8px">
            {position.toNumber().toFixed(3)} {name}
          </Text>
        ) : (
          <Text color="text" fontWeight="600" fontSize="16px" mt="8px">
            {8.01} BNB
          </Text>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default PositionValueCell
