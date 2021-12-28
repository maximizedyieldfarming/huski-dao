import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Button } from 'husky-uikit1.0'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  // flex: 1 0 50px;
  flex:1;
  justify-content: flex-start;
    align-items: start;
  ${({ theme }) => theme.mediaQueries.md} {
    // flex: 1 0 120px;
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
interface Props {
  disabled: boolean
}
const StyledButton = styled(Button) <Props>`
  background:${({ disabled }) => (disabled ? '#FFFFFF' : '#7B3FE4')};
  border-radius:10px;
  color: ${({ disabled }) => (!disabled ? 'white' : '#6F767E')};
  text-align: center;
  width:140px;
  height:40px;
  border:${({ disabled }) => (disabled ? '1px solid #EFEFEF' : 'none')};
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
          disabled={!token?.userData?.tokenBalanceIB || !account }
          onClick={(e) => !account && e.preventDefault()}
        >
          {t('Deposit')}
        </StyledButton>
        <StyledButton
          as={Link}
          to={{ pathname: `/lend/withdraw/${name.replace('wBNB', 'BNB')}`, state: { exchangeRate, token } }}
          disabled={!token?.userData?.tokenBalanceIB || !account }
          onClick={(e) => !account && e.preventDefault()}
        >
          {t('Withdraw')}
        </StyledButton>
      </CellContent>
    </StyledCell>
  )
}

export default ActionCell
