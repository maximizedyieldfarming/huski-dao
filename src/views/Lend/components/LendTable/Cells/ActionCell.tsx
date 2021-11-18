import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Button } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  ${CellContent} {
    align-items: unset;
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

const ActionCell = ({ token }) => {
  const { account } = useWeb3React()
  const name = token?.TokenInfo.token?.symbol
  const exchangeRate = new BigNumber(token.totalToken).div(token.totalSupply)
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Button
          as={Link}
          to={{
            pathname: `/lend/deposit/${name.replace('wBNB', 'BNB')}`,
            state: { token },
          }}
          disabled={!token?.userData?.tokenBalanceIB || !account || exchangeRate.isNaN()}
          onClick={(e) => !token?.userData?.tokenBalanceIB || !account || exchangeRate.isNaN() && e.preventDefault()}
        >
          {t('Deposit')}
        </Button>
        <Button
          as={Link}
          to={{ pathname: `/lend/withdraw/${name.replace('wBNB', 'BNB')}`, state: { token } }}
          disabled={!token?.userData?.tokenBalanceIB || !account || exchangeRate.isNaN()}
          onClick={(e) =>!token?.userData?.tokenBalanceIB || !account || exchangeRate.isNaN() && e.preventDefault()}
        >
          {t('Withdraw')}
        </Button>
      </CellContent>
    </StyledCell>
  )
}

export default ActionCell
