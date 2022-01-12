import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import { formatBigNumber } from 'state/utils'
import nFormatter from 'utils/nFormatter'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 6rem;
  }
`

const TotalValueCell = ({ valueStaked }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()

  const { t } = useTranslation()
  const formatedSupply = valueStaked && parseFloat(formatBigNumber(Number(valueStaked)).replace(/,/g, ''))

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize={isMobile || isTablet ? '1rem' : '12px'} color="textSubtle" textAlign="left">
          {t('Total Value Staked')}
        </Text>
        {valueStaked ? (
          <Text fontWeight="500" mt="10px">
            {nFormatter(formatedSupply)}
          </Text>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalValueCell
