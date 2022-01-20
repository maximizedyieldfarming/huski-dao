import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Box } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import nFormatter from 'utils/nFormatter'
import { formatBigNumber } from '../../../../../state/utils'
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

const TotalBorrowedCell = ({ borrowed, borrowedUSD, name }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const formatedBorrowed = borrowed && parseFloat(formatBigNumber(borrowed).replace(/,/g, ''))
  const formatedBorrowedUSD = borrowedUSD && Number(formatBigNumber(borrowedUSD).replace(/,/g, ''))
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            {t('Total Borrowed')}
          </Text>
        )}
        {borrowed ? (
          <Box>
            <Text bold color="text" fontSize="16px" style={{ marginBottom: '9px' }}>
              {nFormatter(formatedBorrowed)} {name}
            </Text>
            <Text fontSize="12px" color="textSubtle">{`$${nFormatter(formatedBorrowedUSD)}`}</Text>
          </Box>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalBorrowedCell
