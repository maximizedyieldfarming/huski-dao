import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Skeleton, Box } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import nFormatter from 'utils/nFormatter'
import { formatBigNumber } from '../../../../../state/utils'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex: 1 0 120px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: column;
    }
  }
`

const TotalBorrowedCell = ({ borrowed, borrowedUSD }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const formatedBorrowed = borrowed && parseFloat(formatBigNumber(borrowed).replace(/,/g, ''))
  const formatedBorrowedUSD = borrowedUSD && Number(formatBigNumber(borrowedUSD).replace(/,/g, ''))

  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            Total Borrowed
          </Text>
        )}
        {borrowed ? (
          <Box>
            <Text>{nFormatter(formatedBorrowed)}</Text>
            <Text small color="textSubtle">{`($${nFormatter(formatedBorrowedUSD)})`}</Text>
          </Box>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalBorrowedCell
