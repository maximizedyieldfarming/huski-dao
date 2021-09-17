import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Button } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  > div {
    gap: 5px;
  }
`
const StyledButton = styled(Button)`
  padding: 0.75rem;
  font-size: 14px;
  font-weight: 400;
  height: auto;
  box-shadow: none;
  word-break: initial;
`

const ActionCell = ({ name }) => {
  const { isMobile } = useMatchBreakpoints()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Button as={Link} to={`/levarage/farm/${name}`}>
          Farm
        </Button>
      </CellContent>
    </StyledCell>
  )
}

export default ActionCell
