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
  background:#7B3FE4;
  border-radius:12px;
  color: white;
  text-align: center;
  width:110px;
  height:40px;
`

const ActionCell = ({ token }) => {
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWeb3React()
  // const tokenData = token
  const name = token?.TokenInfo.token?.symbol
  const exchangeRate = parseInt(token.totalToken) / parseInt(token.totalSupply)
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent>
        <StyledButton
          as={Link}
          to={{
            pathname: `/lend/deposit/${name.replace('wBNB', 'BNB')}`,
            state: { exchangeRate, token },
          }}
          disabled={!token?.userData?.tokenBalanceIB || !account}
          onClick={(e) => !account && e.preventDefault()}
        >
          {t('Deposit')}
        </StyledButton>
        <StyledButton
          as={Link}
          to={{ pathname: `/lend/withdraw/${name.replace('wBNB', 'BNB')}`, state: { exchangeRate, token } }}
          disabled={!token?.userData?.tokenBalanceIB || !account}
          onClick={(e) => !account && e.preventDefault()}
        >
          {t('Withdraw')}
        </StyledButton>
      </CellContent>
    </StyledCell>
  )
}

export default ActionCell
