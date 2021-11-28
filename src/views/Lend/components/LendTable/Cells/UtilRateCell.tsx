import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Skeleton } from 'husky-uikit1.0'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  // flex: 1 0 50px;
  flex:1;
  ${({ theme }) => theme.mediaQueries.lg} {
    // flex: 1 0 120px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: flex-start;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: column;
    }
  }
`

const UtilRateCell = ({ utilRate }) => {
  const utilizationRateToPercentage = (rate) => {
    const value = rate * 100
    return `${value.toFixed(2)}%`
  }
  const { t } = useTranslation()

  const { isMobile, isTablet } = useMatchBreakpoints()
  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Text   textAlign="left">
            {t('Utilization')}
          </Text>
        )}
        {utilRate ? <Text style={{fontWeight:600,fontSize:'16px', marginTop:'10px'}} color="text">{utilizationRateToPercentage(utilRate)}</Text> : <Skeleton width="80px" height="16px" />}
      </CellContent>
    </StyledCell>
  )
}

export default UtilRateCell
