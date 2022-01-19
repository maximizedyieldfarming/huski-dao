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

const TotalVolumeCell = ({ volumeLocked, name }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()

  const { t } = useTranslation()
  const formatedSupply1 = volumeLocked && parseFloat(formatBigNumber(Number(volumeLocked)).replace(/,/g, ''))
  const formatedSupply = formatedSupply1.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize={isMobile || isTablet ? '1rem' : '12px'} color="textSubtle" textAlign="left">
          {t('Total %name% Locked', {name})}
        </Text>
        {volumeLocked ? (
          <Text fontWeight="500" marginTop={isMobile || isTablet ? '0px' : '10px'}>
            {/* {nFormatter(formatedSupply) || '0.00'} */}
            {formatedSupply}
          </Text>
        ) : (
          <Skeleton width="80px" height="16px" marginTop={isMobile || isTablet ? '0px' : '10px'} />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalVolumeCell
