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
`

const UtilRateCell = ({ utilRate }) => {
  const utilizationRateToPercentage = (rate) => {
    const value = new BigNumber(rate).times(100).toFixed(2, 1)
    return `${value}%`
  }
  const { t } = useTranslation()

  const { isMobile, isTablet } = useMatchBreakpoints()
  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            {t('Utilization')}
          </Text>
        )}
        {utilRate ? <Text style={{fontWeight:600,fontSize:'16px', marginTop:'10px'}} color="text">{utilizationRateToPercentage(utilRate)}</Text> : <Skeleton width="80px" height="16px" />}
      </CellContent>
    </StyledCell>
  )
}

export default UtilRateCell
