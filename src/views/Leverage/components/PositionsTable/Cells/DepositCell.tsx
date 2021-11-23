import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints } from 'husky-uikit1.0'
import BigNumber from 'bignumber.js'

import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`

const DepositCell = ({ deposit }) => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          Deposit
        </Text>
        <Text color="text" fontWeight="700" fontSize="16px">{deposit}</Text>
      </CellContent>
    </StyledCell>
  )
}

export default DepositCell
