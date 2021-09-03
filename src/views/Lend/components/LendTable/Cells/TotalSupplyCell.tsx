import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints } from '@pancakeswap/uikit'
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

const TotalSupplyCell = ({ tokenData }) => {
  const { isMobile } = useMatchBreakpoints()
  const { totalDeposit } = tokenData
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          Total Supply
        </Text>
        <Text>{new BigNumber(totalDeposit).toExponential(3)}</Text>
      </CellContent>
    </StyledCell>
  )
}

export default TotalSupplyCell
