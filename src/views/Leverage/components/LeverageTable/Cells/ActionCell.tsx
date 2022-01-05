import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useMatchBreakpoints, Button } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`
const StyledButton = styled(Button)`
  background-color: ${({ disabled }) => (disabled ? '#D3D3D3' : '#7B3FE4')};
  box-sizing: border-box;
  border-radius: 10px;
  width: 114px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ disabled }) => (disabled ? '#6F767E' : 'white')};
`

const ActionCell = ({ token, selectedLeverage, selectedBorrowing }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const { t } = useTranslation()

  return (
    <StyledCell role="cell" style={{ alignItems: isMobile || isTablet ? 'center' : null }}>
      <CellContent>
        <StyledButton
          as={Link}
          to={(location) => ({
            pathname: `${location.pathname}/farm/${token?.lpSymbol}`,
            state: { tokenData: token, selectedLeverage, selectedBorrowing },
          })}
          disabled={!token?.totalSupply || !account}
          onClick={(e) => (!token?.totalSupply || !account) && e.preventDefault()}
        >
          {t('Farm')}
        </StyledButton>
      </CellContent>
    </StyledCell>
  )
}

export default ActionCell
