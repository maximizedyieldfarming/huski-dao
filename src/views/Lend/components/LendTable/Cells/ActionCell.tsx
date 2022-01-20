import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Button } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 0 0 12rem;
  }
  ${CellContent} {
    gap: 10px;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: row !important;
    }
  }
`
const StyledButton = styled(Button)`
  text-align: center;
  padding: 0.75rem;
  font-size: 14px;
  font-weight: 400;
  font-family: 'GenJyuuGothic';
  box-shadow: none;
  word-break: initial;
  border-radius: 10px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ disabled, theme }) => (disabled ? '#6F767E' : theme.isDark ? 'white' : '#7b3fe4')};
  background-color: ${({theme}) => theme.isDark ? '#1A1D1F' : 'white' };
  border: 1px solid ${({ theme, disabled }) => (disabled ? '#6F767E' : theme.isDark ? '#272B30' : '#7B3FE4')};
  &:hover {
    background-color: ${({ disabled }) => (disabled ? 'transparent' : '#7b3fe4')};
    border: 1px solid ${({ disabled }) => (disabled ? '#6F767E' : '#7b3fe4')};
    color: ${({ disabled }) => (disabled ? '#6F767E' : 'white')};
  }
`

const ActionCell = ({ token, apyReady }) => {
  const { account } = useWeb3React()
  const name = token?.TokenInfo.token?.symbol
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent>
        <StyledButton
          style={{
            width: '50%',
            height: '40px',
          }}
          as={Link}
          to={{
            pathname: `/lend/deposit/${name.replace('wBNB', 'BNB')}`,
            state: { token },
          }}
          disabled={!apyReady || !account}
          onClick={(e) => !account || (!apyReady && e.preventDefault())}
        >
          {t('Deposit')}
        </StyledButton>
        <StyledButton
          style={{
            width: '50%',
            height: '40px',
          }}
          as={Link}
          to={{ pathname: `/lend/withdraw/${name.replace('wBNB', 'BNB')}`, state: { token } }}
          disabled={!apyReady || !account}
          onClick={(e) => !account || (!apyReady && e.preventDefault())}
        >
          {t('Withdraw')}
        </StyledButton>
      </CellContent>
    </StyledCell>
  )
}

export default ActionCell
