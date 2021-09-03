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

const UtilRateCell = ({ tokenData }) => {
  const utilizationRateToPercentage = (utilRate) => {
    const value = utilRate * 100
    return `${value.toFixed(2)}%`
  }

  const { isMobile } = useMatchBreakpoints()
  const { capitalUtilizationRate } = tokenData
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          Utilization Rate
        </Text>
        <Text>{utilizationRateToPercentage(capitalUtilizationRate)}</Text>
      </CellContent>
    </StyledCell>
  )
}

export default UtilRateCell
