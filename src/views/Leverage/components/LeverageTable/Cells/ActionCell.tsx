import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Button } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
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

const ActionCell = ({ token, selectedLeverage, selectedBorrowing }) => {
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWeb3React()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Button
          as={Link}
          to={{
            pathname: `/leverage/farm/${token?.lpSymbol}`,
            state: { tokenData: token, selectedLeverage, selectedBorrowing },
          }}
          disabled={!token?.totalSupply || !account}
          onClick={(e) => (!token?.totalSupply || !account) && e.preventDefault()}
        >
          Farm
        </Button>
      </CellContent>
    </StyledCell>
  )
}

export default ActionCell
