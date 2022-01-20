import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Box } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import nFormatter from 'utils/nFormatter'
import { formatBigNumber } from 'state/utils'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 auto;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 5rem;
  }
  ${Text} {
    font-family: 'GenJyuuGothic';
  }
`

const TotalSupplyCell = ({ supply, supplyUSD, name }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()

  const formatedSupply = supply && Number(formatBigNumber(supply).replace(/,/g, ''))
  const formatedSupplyUSD = supplyUSD && Number(formatBigNumber(supplyUSD).replace(/,/g, ''))
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            {t('Total Supply')}
          </Text>
        )}
        {supply ? (
          <Box>
            <Text fontSize="16px" bold color="text" style={{ marginBottom: '9px' }}>
              {nFormatter(formatedSupply)} {name}
            </Text>
            <Text fontSize="12px" color="textSubtle">{`$${nFormatter(formatedSupplyUSD)}`}</Text>
          </Box>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalSupplyCell
