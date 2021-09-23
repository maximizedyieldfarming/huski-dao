import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
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
  a {
    padding: 0.75rem;
    font-size: 14px;
    font-weight: 400;
    height: auto;
    box-shadow: none;
    word-break: initial;
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

const ActionCell = ({ token }) => {
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const tokenData = token
  const name = token?.token?.symbol
  const exchangeRate = parseInt(token.totalToken) / parseInt(token.totalSupply)
  const {
    userData: { allowance },
  } = token
  // console.log({ allowance })
  return (
    <StyledCell role="cell">
      <CellContent>
        <Button
          as={Link}
          to={{ pathname: `/lend/deposit/${name}`, state: { exchangeRate, allowance, tokenData } }}
          disabled={!exchangeRate || !account}
        >
          Deposit
        </Button>
        <Button
          as={Link}
          to={{ pathname: `/lend/withdraw/${name}`, state: { exchangeRate, allowance } }}
          disabled={!exchangeRate || !account}
        >
          Withdraw
        </Button>
      </CellContent>
    </StyledCell>
  )
}

export default ActionCell
