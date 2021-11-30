import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
<<<<<<< HEAD
import { Text, useMatchBreakpoints, Skeleton, Flex, useTooltip, InfoIcon } from 'husky-uikit1.0'
=======
import { Text, useMatchBreakpoints, Skeleton, Flex, useTooltip, InfoIcon } from '@pancakeswap/uikit'
>>>>>>> v1/master
import BigNumber from 'bignumber.js'

import { useTranslation } from 'contexts/Localization'
import Tooltip from 'components/Tooltip'
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

const LiquidatedEquityCell = ({ liqEquity }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>{t('Liquidated Equity = 83.33% * Equity Value')}</Text>
    </>,
    { placement: 'top-start' },
  )

  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Liquidated Equity')}
            </Text>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
        )}
<<<<<<< HEAD
        {liqEquity ? <Text  color="text" fontWeight="600" fontSize="16px" mt='8px'>{liqEquity}</Text> : <Skeleton width="80px" height="16px" />}
=======
        {liqEquity ? <Text>{liqEquity}</Text> : <Skeleton width="80px" height="16px" />}
>>>>>>> v1/master
      </CellContent>
    </StyledCell>
  )
}

export default LiquidatedEquityCell
