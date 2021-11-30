import React from 'react'
import styled from 'styled-components'
<<<<<<< HEAD
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip, TooltipText } from 'husky-uikit1.0'
=======
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip, TooltipText } from '@pancakeswap/uikit'
>>>>>>> v1/master

import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
<<<<<<< HEAD
  ${CellContent} {
    flex-direction: row;
    justify-content: flex-start;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
=======
>>>>>>> v1/master
`

const DebtRatioCell = ({ debtRatio }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>{t('Debt Ratio = Debt Value / Position Value')}</Text>
    </>,
    { placement: 'top-start' },
  )
  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Debt Ratio')}
            </Text>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
        )}
        {debtRatio && !debtRatio.isNaN() ? (
<<<<<<< HEAD
          <Text color="text" fontWeight="600" fontSize="16px" mt="8px">{(debtRatio.toNumber() * 100).toFixed(2)}%</Text>
        ) : (
          <Text color="text" fontWeight="600" fontSize="16px" mt="8px">56.23%</Text>
=======
          <Text>{(debtRatio.toNumber() * 100).toFixed(2)}%</Text>
        ) : (
          <Skeleton width="80px" height="16px" />
>>>>>>> v1/master
        )}
      </CellContent>
    </StyledCell>
  )
}

export default DebtRatioCell
