import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import shortenExponentValues from 'utils/shortenExponentValeus'
import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0 0 120px;
  }
`

const TotalBorrowedCell = ({ tokenData }) => {
  const { isMobile } = useMatchBreakpoints()
  const { totalBorrowed } = tokenData
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          Total Borrowed
        </Text>
        <Text>{shortenExponentValues(totalBorrowed)}</Text>
      </CellContent>
    </StyledCell>
  )
}

export default TotalBorrowedCell
