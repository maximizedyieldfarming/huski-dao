import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'

import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`
const YieldCell = ({ yieldData }) => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          Yield
        </Text>
        <Text>{yieldData}</Text>
      </CellContent>
    </StyledCell>
  )
}

export default YieldCell
